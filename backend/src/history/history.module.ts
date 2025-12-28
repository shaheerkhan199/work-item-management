import { Module } from "@nestjs/common"
import { HistoryService } from "./history.service"
import { HistoryController } from "./history.controller"
import { PrismaModule } from "../prisma/prisma.module"
import { UserStatusGuard } from "../common/guards/user-status.guard"

@Module({
  imports: [PrismaModule],
  controllers: [HistoryController],
  providers: [HistoryService, UserStatusGuard],
  exports: [HistoryService],
})
export class HistoryModule {}
