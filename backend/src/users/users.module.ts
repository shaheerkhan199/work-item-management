import { Module } from "@nestjs/common"
import { UsersService } from "./users.service"
import { UsersController } from "./users.controller"
import { PrismaModule } from "../prisma/prisma.module"
import { UserStatusGuard } from "../common/guards/user-status.guard"

@Module({
  imports: [PrismaModule],
  controllers: [UsersController],
  providers: [UsersService, UserStatusGuard],
  exports: [UsersService],
})
export class UsersModule {}
