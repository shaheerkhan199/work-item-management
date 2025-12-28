import { Controller, Get, Post, Body, Param, Patch, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { WorkItemsService } from "./work-items.service"
import { Roles } from "../common/decorators/roles.decorator"
import { RolesGuard } from "../common/guards/roles.guard"
import { CurrentUser } from "../common/decorators/current-user.decorator"
import { CreateWorkItemDto } from "./dto/create-work-item.dto"
import { UpdateWorkItemDto } from "./dto/update-work-item.dto"
import { TransitionStateDto } from "./dto/transition-state.dto"
import { BlockWorkItemDto } from "./dto/block-work-item.dto"
import type { JwtPayload } from "../common/types"

@Controller("work-items")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class WorkItemsController {
  constructor(private workItemsService: WorkItemsService) {}

  @Post()
  @Roles("ADMIN", "OPERATOR", "VIEWER")
  create(createDto: CreateWorkItemDto, @CurrentUser() user: JwtPayload) {
    return this.workItemsService.create(createDto, user.sub)
  }

  @Get()
  @Roles("ADMIN", "OPERATOR", "VIEWER")
  findAll(@CurrentUser() user: JwtPayload) {
    return this.workItemsService.findAll(user.sub, user.role)
  }

  @Get(":id")
  @Roles("ADMIN", "OPERATOR", "VIEWER")
  findById(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.workItemsService.findById(id, user.sub, user.role)
  }

  @Patch(":id")
  @Roles("ADMIN", "OPERATOR")
  update(@Param("id") id: string, updateDto: UpdateWorkItemDto, @CurrentUser() user: JwtPayload) {
    return this.workItemsService.update(id, updateDto, user.sub, user.role)
  }

  @Post(":id/transition")
  @Roles("ADMIN", "OPERATOR")
  transitionState(@Param("id") id: string, transitionDto: TransitionStateDto, @CurrentUser() user: JwtPayload) {
    return this.workItemsService.transitionState(id, transitionDto, user.sub, user.role)
  }

  @Post(":id/block")
  @Roles("ADMIN", "OPERATOR")
  block(@Param("id") id: string, blockDto: BlockWorkItemDto, @CurrentUser() user: JwtPayload) {
    return this.workItemsService.blockWorkItem(id, blockDto, user.sub, user.role)
  }

  @Post(":id/unblock")
  @Roles("ADMIN", "OPERATOR")
  unblock(@Param("id") id: string, @CurrentUser() user: JwtPayload) {
    return this.workItemsService.unblockWorkItem(id, user.sub, user.role)
  }

  @Post(":id/rework")
  @Roles("ADMIN", "OPERATOR")
  rework(@Param("id") id: string, @Body("reason") reason: string, @CurrentUser() user: JwtPayload) {
    return this.workItemsService.reworkWorkItem(id, reason, user.sub, user.role)
  }
}
