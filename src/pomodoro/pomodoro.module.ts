import { Module } from "@nestjs/common";
import { PomodoroController } from "./pomodoro.controller";
import { PomodoroService } from "./pomodoro.service";
import { PrismaService } from "src/prisma.service";
import { UserService } from "src/user/user.service";

@Module({
    controllers: [PomodoroController],
    providers: [PomodoroService, PrismaService, UserService],
    exports: [PomodoroService]
})
export class PomodoroModule{}