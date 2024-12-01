import { Priority } from "@prisma/client";
import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

export class TaskDto {
    @IsString()
    @IsOptional()
    name: string

    @IsBoolean()
    @IsOptional()
    isCompleted?: boolean

    @IsString()
    @IsOptional()
    createAt?: string

    @IsEnum(Priority)
    @IsOptional()
    @Transform(({ value }) => ("" + value).toLowerCase())
    priority?: Priority
    
}