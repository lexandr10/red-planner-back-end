import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from "@nestjs/common";
import { Auth } from "src/auth/decorators/auth.decorator";
import { CurrentUser } from "src/auth/decorators/user.decorator";
import { TaskService } from "./task.service";
import { TaskDto } from "./task.dto";



@Controller('user/task')
export class TaskController{ 
    constructor(private readonly taskService: TaskService) { }
    
    @Get()
    @Auth()
    async getAllTask(@CurrentUser("id") userId: string ) {
    return this.taskService.getAllTasks(userId)
    }

    @UsePipes(new ValidationPipe())
    @Post()
    @HttpCode(200)
    @Auth()
    async createTask(@Body() dto: TaskDto, @CurrentUser("id") userId: string) {
        return this.taskService.createTask(dto, userId)
    }

    @UsePipes(new ValidationPipe())
    @HttpCode(200)
    @Put(':id')
    @Auth()
    async updateTask(
        @Body() dto: TaskDto,
        @CurrentUser('id') userId: string,
        @Param('id') id: string
    ) {
        return this.taskService.updateTask(dto, id, userId)
    }

    @HttpCode(200)
    @Delete(':id')
    @Auth()
    async deleteTask(@Param('id') id: string, @CurrentUser('id') userId: string) {
        return this.taskService.deleteTask(id, userId)
    }

}