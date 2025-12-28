import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@nestjs/passport"
import type { HistoryService } from "./history.service"
import { Roles } from "../common/decorators/roles.decorator"
import { RolesGuard } from "../common/guards/roles.guard"
import type { JwtPayload } from "../common/types"

@Controller("history")
@UseGuards(AuthGuard("jwt"), RolesGuard)
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @Get("work-item/:workItemId")
  @Roles("ADMIN", "OPERATOR", "VIEWER")
  getWorkItemHistory(workItemId: string, user: JwtPayload) {
    return this.historyService.getWorkItemHistory(workItemId, user.sub, user.role)
  }

  @Get("user/me")
  @Roles("ADMIN", "OPERATOR", "VIEWER")
  getUserActivity(@Query("limit") limit?: string, user: JwtPayload) {
    const limitNum = limit ? Number.parseInt(limit, 10) : 50
    return this.historyService.getUserActivity(user.sub, limitNum)
  }

  @Get("all")
  @Roles("ADMIN")
  getAllHistory(@Query("limit") limit?: string) {
    const limitNum = limit ? Number.parseInt(limit, 10) : 100
    return this.historyService.getAllHistory(limitNum)
  }
}
