import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { RecordEventDto } from "./dto/record-event.dto"
import type { UserRole } from "../common/types"

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async recordEvent(eventDto: RecordEventDto) {
    return this.prisma.historyEvent.create({
      data: {
        workItemId: eventDto.workItemId,
        eventType: eventDto.eventType,
        previousState: eventDto.previousState,
        newState: eventDto.newState,
        details: eventDto.details,
        performedById: eventDto.performedById,
      },
      include: {
        performedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })
  }

  async getWorkItemHistory(workItemId: string, userId: string, userRole: UserRole) {
    // Verify work item exists and check authorization
    const workItem = await this.prisma.workItem.findUnique({
      where: { id: workItemId },
    })

    if (!workItem) {
      throw new NotFoundException(`Work item ${workItemId} not found`)
    }

    // VIEWER and OPERATOR can only access history for their own work items
    if (userRole !== "ADMIN" && workItem.createdById !== userId) {
      throw new ForbiddenException("You do not have access to this work item's history")
    }

    return this.prisma.historyEvent.findMany({
      where: { workItemId },
      include: {
        performedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  async getUserActivity(userId: string, limit = 50) {
    return this.prisma.historyEvent.findMany({
      where: { performedById: userId },
      include: {
        workItem: {
          select: {
            id: true,
            title: true,
            currentState: true,
          },
        },
        performedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  }

  async getAllHistory(limit = 100) {
    return this.prisma.historyEvent.findMany({
      include: {
        workItem: {
          select: {
            id: true,
            title: true,
            currentState: true,
          },
        },
        performedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  }
}
