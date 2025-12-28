import { IsString, MinLength, IsOptional } from "class-validator"

export class UpdateWorkItemDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string

  @IsOptional()
  @IsString()
  description?: string
}
