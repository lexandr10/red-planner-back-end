import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class PomodoroSessionDto {
    @IsBoolean()
    @IsOptional()
    isCompeted: boolean
}

export class PomodoroRoundDto {
    @IsNumber()
    totalSeconds: number

    @IsOptional()
    @IsBoolean()
    isCompeted: boolean
}