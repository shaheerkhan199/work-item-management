import { Injectable, type CanActivate, type ExecutionContext, ForbiddenException } from "@nestjs/common"
import { PrismaService } from "../../prisma/prisma.service"

@Injectable()
export class UserStatusGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user || !user.sub) {
      throw new ForbiddenException("User not authenticated")
    }

    // Get current user status from database
    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { status: true },
    })

    if (!dbUser) {
      throw new ForbiddenException("User not found")
    }

    // SUSPENDED users cannot perform any actions
    if (dbUser.status === "SUSPENDED") {
      throw new ForbiddenException("Your account has been suspended. Please contact an administrator.")
    }

    // INACTIVE users cannot perform actions (should not reach here if login is working correctly)
    if (dbUser.status === "INACTIVE") {
      throw new ForbiddenException("Your account is pending approval. Please contact an administrator.")
    }

    return true
  }
}

