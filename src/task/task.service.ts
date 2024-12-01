import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { TaskDto } from "./task.dto";


@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) { }
    async getAllTasks(userId: string) {
        return this.prisma.task.findMany({
            where: {
                userId
            }
        })
    }

    async createTask(dto: TaskDto, userId: string) {
        return this.prisma.task.create({
            data: {
                name: dto.name ? dto.name : "",
                ...dto,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
    }

    async updateTask(dto: Partial<TaskDto>, taskId: string, userId: string) {
        return this.prisma.task.update({
            where: {
                userId,
                id: taskId
            },
            data: dto
        })
    }

    async deleteTask(taskId: string, userId: string) {
        return this.prisma.task.delete({
            where: {
                id: taskId,
                userId
                
            }
        })
    }
    
   
}