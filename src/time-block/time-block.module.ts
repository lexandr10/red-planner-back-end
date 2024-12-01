import { Module } from "@nestjs/common";
import { TimeBlockController } from "./time-block.controller";
import { TimeBlockService } from "./time-block.service";
import { PrismaService } from "src/prisma.service";

@Module({
    controllers: [TimeBlockController],
    providers: [TimeBlockService, PrismaService],
    exports: [TimeBlockService]
})

export class TimeBlockModule {}