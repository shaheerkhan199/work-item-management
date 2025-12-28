import { IsString, IsEnum, IsOptional } from "class-validator"
import type { WorkItemState } from "../../common/types"

export class TransitionStateDto {
  @IsEnum(["CREATED", "IN_PROGRESS", "IN_REVIEW", "REWORK", "COMPLETED"])
  newState!: WorkItemState

  @IsOptional()
  @IsString()
  reason?: string
}
