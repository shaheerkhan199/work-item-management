import { IsString } from "class-validator"

export class BlockWorkItemDto {
  @IsString()
  reason!: string
}
