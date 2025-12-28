import { Module } from "@nestjs/common"
import { WorkItemsService } from "./work-items.service"
import { WorkItemsController } from "./work-items.controller"
import { PrismaModule } from "../prisma/prisma.module"
import { HistoryModule } from "../history/history.module"

@Module({
  imports: [PrismaModule, HistoryModule],
  controllers: [WorkItemsController],
  providers: [WorkItemsService],
  exports: [WorkItemsService],
})
export class WorkItemsModule {}
