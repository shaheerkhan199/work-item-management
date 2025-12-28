import { Controller, Get, Param, Patch, Body, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import { UsersService } from "./users.service"
import { Roles } from "../common/decorators/roles.decorator"
import { RolesGuard } from "../common/guards/roles.guard"
import { UserStatusGuard } from "../common/guards/user-status.guard"
import { CurrentUser } from "../common/decorators/current-user.decorator"
import type { JwtPayload } from "../common/types"

@Controller("users")
@UseGuards(AuthGuard("jwt"), RolesGuard, UserStatusGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get("me")
  @Roles("ADMIN", "OPERATOR", "VIEWER")
  getCurrentUser(@CurrentUser() user: JwtPayload) {
    return this.usersService.findById(user.sub)
  }

  @Get()
  @Roles("ADMIN")
  getAllUsers() {
    return this.usersService.findAll()
  }

  @Patch(":id/role")
  @Roles("ADMIN")
  updateUserRole(@Param("id") id: string, @Body("role") role: string) {
    return this.usersService.updateRole(id, role as any)
  }

  @Patch(":id/status")
  @Roles("ADMIN")
  updateUserStatus(@Param("id") id: string, @Body("status") status: string) {
    return this.usersService.updateStatus(id, status as any)
  }
}
