import { Module } from "@nestjs/common"
import { WorkItemsService } from "./work-items.service"
import { WorkItemsController } from "./work-items.controller"
import { PrismaModule } from "../prisma/prisma.module"
import { HistoryModule } from "../history/history.module"
import { UserStatusGuard } from "../common/guards/user-status.guard"

@Module({
  imports: [PrismaModule, HistoryModule],
  controllers: [WorkItemsController],
  providers: [WorkItemsService, UserStatusGuard],
  exports: [WorkItemsService],
})
export class WorkItemsModule {}
