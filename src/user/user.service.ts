import { Injectable } from '@nestjs/common';
import { hash } from 'argon2';
import { startOfDay, subDays } from 'date-fns';

import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()

export class UserService {
    constructor(private prisma: PrismaService) {

    }

    async getById(id: string) {
        return this.prisma.user.findUnique({
            where: {
                id
            },
            include: {
                tasks: true
            }
        })
    }

    async getByEmail(email: string) {
         return  this.prisma.user.findUnique({
            where: {
                email
            }
        })
        
    }

    async create(dto: AuthDto) {
        const user = {
            email: dto.email,
            name: "",
            password: await hash(dto.password)
        }
        return this.prisma.user.create({
            data: user
        })
    }

    async getProfile(id: string) {
        const profile = await this.getById(id)

        const totalTasks = profile.tasks.length
        const completedTasks = await this.prisma.task.count({
            where: {
                userId: id,
                isCompleted: true
            }
        }) 
        const todayStart = startOfDay(new Date())
        const weekStart = startOfDay(subDays(new Date(), 7))

        const todayTasks = this.prisma.task.count({
            where: {
                userId: id,
                createdAt: {
                    gte: todayStart.toISOString()
                }
            }
        })

        const weekTasks = this.prisma.task.count({
            where: {
                userId: id,
                createdAt: {
                    gte: weekStart.toISOString()
                }
            }
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...rest } = profile
        return {
            user: rest,
            statistic: [
                { label: 'Total', value: totalTasks },
                { label: 'Completed taks', value: completedTasks },
                { label: 'Today tasks', value: todayTasks },
                { label: 'Week tasks', value: weekTasks }
            ]
        }
    }

    async update(id: string, dto: UserDto) {
        let data = dto
        if (data.password) {
            data = {...dto, password: await hash(data.password)}
        }
        return this.prisma.user.update({
            where: {
                id
            },
            data,
            select: {
                name: true,
                email: true
            }
        })
    }
    
    async getIntervalUser(userId: string) {
        return this.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                intervalCount: true
            }
        })
    }
}

