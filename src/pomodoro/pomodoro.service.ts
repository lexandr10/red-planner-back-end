import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { UserService } from "src/user/user.service";
import { PomodoroRoundDto, PomodoroSessionDto } from "./pomodoro.dto";

@Injectable()

export class PomodoroService {
    constructor(private prisma: PrismaService,
        private userService: UserService
    ) { }
    
    async getTodaySession(userId: string) {
        const today = new Date().toISOString().split("T")[0]
        return this.prisma.pomodoroSession.findFirst({
            where: {
                userId,
                createdAt: {
                    gte: new Date(today)
                }
            },
            include: {
                round: {
                    orderBy: {
                        id: "asc"
                    }
                }
            }
        })
    }

    async create(userId: string) {
        const todaySession = await this.getTodaySession(userId)
        
        if (todaySession) return todaySession
        
        const user = await this.userService.getIntervalUser(userId)

        if (!user) throw new NotFoundException("User not found")
        
        return this.prisma.pomodoroSession.create({
            data: {
                round: {
                    createMany: {
                        data: Array.from({ length: user.intervalCount }, () => ({
                            totalSeconds:0
                        }))
                    }
                },
                user: {
                    connect: {
                        id: userId
                    }
                }
            },
            include: {
                round: true
            }
        
        })
        
    }

   	async update(
		dto: Partial<PomodoroSessionDto>,
		pomodoroId: string,
		userId: string
	) {
		return this.prisma.pomodoroSession.update({
			where: {
				userId,
				id: pomodoroId
			},
			data: dto
		})
	}

    async updateRound(dto: Partial<PomodoroRoundDto>, roundId: string) {
        return this.prisma.pomodoroRound.update({
            where: {
                id: roundId
            },
            data: dto
        })
    }

    async deleteSession(sessionId: string,userId: string) {
        return this.prisma.pomodoroSession.delete({
            where: {
                id: sessionId,
                userId
    }
})
    }
}