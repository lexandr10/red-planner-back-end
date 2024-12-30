import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';

import { UserService } from 'src/user/user.service';
import { AuthDto } from './dto/auth.dto';
import { Response } from 'express';

@Injectable()
export class AuthService {
    EXPIRE_DAY_REFRESH_TOKEN = 1
    REFRESH_TOKEN_NAME = "refreshToken"

    constructor(
        private jwt: JwtService,
        private userService: UserService
    ) { }
    async login(dto: AuthDto) {
       // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...user } = await this.validationUser(dto);
        const token =  this.issuieToken(user.id)
        return {user, ...token}
    }

    async register(dto: AuthDto) {
        const oldUser = await this.userService.getByEmail(dto.email)
        if (oldUser) throw new BadRequestException("User already exist")
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...user } = await this.userService.create(dto)
        const token = this.issuieToken(user.id)
        return {
            user,
            ...token
        }

        
    }

    private issuieToken(userId: string) {
        const data = { id: userId }
        const accessToken = this.jwt.sign(data, {
            expiresIn: '24h'
        })
        const refreshToken = this.jwt.sign(data, {
            expiresIn: '24h'
        })
        return {accessToken, refreshToken}
    }
    private async validationUser( dto: AuthDto) {
        const user = await this.userService.getByEmail(dto.email)
        if (!user) throw new NotFoundException("User not found")
        const isValid = await verify(user.password, dto.password)
        if (!isValid) throw new UnauthorizedException("Ivalid password")
        return user
    }
    addRefreshTokenToResponse(res: Response, refreshToken: string) {
        const expresiIn = new Date()
        expresiIn.setDate(expresiIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

        res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
            httpOnly: true,
            domain: process.env.NODE_ENV === "production" ? "https://red-planner-front-end.onrender.com" : "localhost",
            expires: expresiIn,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

        })
    }
    removeRefreshTokenFromResponse(res: Response) {
    res.cookie(this.REFRESH_TOKEN_NAME, "", {
            httpOnly: true,
            domain: process.env.NODE_ENV === "production" ? "https://red-planner-front-end.onrender.com" : "localhost",
            expires: new Date(0),
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",

        })
    }
       async getNewToken(refreshToken: string) {
           const result = await this.jwt.verifyAsync(refreshToken)
           if (!result) throw new UnauthorizedException("Invalid refresh token")
           // eslint-disable-next-line @typescript-eslint/no-unused-vars
           const { password, ...user } = await this.userService.getById(result.id)
           const token = this.issuieToken(user.id)
           return {
               user,
               ...token
           }
    }
}
