import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { PomodoroService } from "./pomodoro.service";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "src/auth/decorators/user.decorator";
import { PomodoroRoundDto, PomodoroSessionDto } from "./pomodoro.dto";

@Controller("user/timer")
export class PomodoroController{
    constructor(private readonly pomodoroService: PomodoroService) { }
    
    @Get('today')
    @Auth()
    async getTodaySession(@CurrentUser("id") userId: string) {
        return this.pomodoroService.getTodaySession(userId)
    }

    
    @Post()
    @Auth()
    @HttpCode(200)
    async createSession(@CurrentUser('id') userId: string ) {
        return this.pomodoroService.create(userId)
    }

    @UsePipes(new ValidationPipe())
    @Put('round/:id')
    @HttpCode(200)
    @Auth()
    async updateRound(@Param('id') id: string, @Body() dto: PomodoroRoundDto) {
    return this.pomodoroService.updateRound(dto, id)
    }

    @UsePipes(new ValidationPipe())
    @Put(':id')
    @HttpCode(200)
    @Auth()
    async update(
        @Body() dto: PomodoroSessionDto,
        @Param('id') id: string,
        @CurrentUser("id") userId: string) {
        return this.pomodoroService.update(dto, id, userId)
    }

    @HttpCode(200)
    @Delete(":id")
    @Auth()
    async delete(@CurrentUser("id") userId: string, @Param("id") id: string) {
        return this.pomodoroService.deleteSession(id, userId)
    }
 }