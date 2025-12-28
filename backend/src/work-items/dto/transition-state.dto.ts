import { IsString, IsEnum, IsOptional } from "class-validator"

export class TransitionStateDto {
  @IsEnum(["CREATED", "IN_PROGRESS", "IN_REVIEW", "REWORK", "COMPLETED"])
  newState: string

  @IsOptional()
  @IsString()
  reason?: string
}
