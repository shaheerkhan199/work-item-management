import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { HistoryService } from "../history/history.service"
import { CreateWorkItemDto } from "./dto/create-work-item.dto"
import { UpdateWorkItemDto } from "./dto/update-work-item.dto"
import { TransitionStateDto } from "./dto/transition-state.dto"
import { BlockWorkItemDto } from "./dto/block-work-item.dto"
import type { WorkItemState, UserRole } from "../common/types"

// Define allowed state transitions
const ALLOWED_TRANSITIONS: Record<WorkItemState, WorkItemState[]> = {
  CREATED: ["IN_PROGRESS"],
  IN_PROGRESS: ["IN_REVIEW", "REWORK"],
  IN_REVIEW: ["COMPLETED", "REWORK"],
  REWORK: ["IN_PROGRESS", "IN_REVIEW"],
  COMPLETED: [], // Terminal state
}

@Injectable()
export class WorkItemsService {
  constructor(
    private prisma: PrismaService,
    private historyService: HistoryService,
  ) {}

  async create(createDto: CreateWorkItemDto, userId: string) {
    const workItem = await this.prisma.workItem.create({
      data: {
        title: createDto.title,
        description: createDto.description,
        currentState: "CREATED",
        createdById: userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Record creation in history
    await this.historyService.recordEvent({
      workItemId: workItem.id,
      eventType: "CREATED",
      performedById: userId,
      newState: "CREATED",
    })

    return workItem
  }

  async findAll(userId: string, userRole: UserRole) {
    // VIEWER and OPERATOR can only see work items they created
    const where =
      userRole === "ADMIN"
        ? {}
        : {
            createdById: userId,
          }

    return this.prisma.workItem.findMany({
      where,
      include: {
        createdBy: {
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

  async findById(id: string, userId: string, userRole: UserRole) {
    const workItem = await this.prisma.workItem.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    if (!workItem) {
      throw new NotFoundException(`Work item ${id} not found`)
    }

    // Check authorization
    if (userRole !== "ADMIN" && workItem.createdById !== userId) {
      throw new ForbiddenException("You do not have access to this work item")
    }

    return workItem
  }

  async update(id: string, updateDto: UpdateWorkItemDto, userId: string, userRole: UserRole) {
    // Authorization check
    const workItem = await this.findById(id, userId, userRole)

    // Only ADMIN and OPERATOR can update
    if (userRole === "VIEWER") {
      throw new ForbiddenException("Viewers cannot update work items")
    }

    const updated = await this.prisma.workItem.update({
      where: { id },
      data: {
        title: updateDto.title ?? workItem.title,
        description: updateDto.description ?? workItem.description,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Record update in history
    await this.historyService.recordEvent({
      workItemId: id,
      eventType: "UPDATED",
      performedById: userId,
      details: JSON.stringify(updateDto),
    })

    return updated
  }

  async transitionState(id: string, transitionDto: TransitionStateDto, userId: string, userRole: UserRole) {
    // Authorization check
    const workItem = await this.findById(id, userId, userRole)

    // Users can only transition states of their own work items (unless ADMIN)
    if (userRole !== "ADMIN" && workItem.createdById !== userId) {
      throw new ForbiddenException("You can only change the state of your own work items")
    }

    // Check if work item is blocked
    if (workItem.isBlocked) {
      throw new BadRequestException(`Work item is blocked. Reason: ${workItem.blockedReason || "No reason provided"}`)
    }

    // Validate state transition
    const allowedNextStates = ALLOWED_TRANSITIONS[workItem.currentState]
    if (!allowedNextStates.includes(transitionDto.newState)) {
      throw new BadRequestException(
        `Cannot transition from ${workItem.currentState} to ${transitionDto.newState}. Allowed states: ${allowedNextStates.join(", ")}`,
      )
    }

    const updated = await this.prisma.workItem.update({
      where: { id },
      data: {
        currentState: transitionDto.newState,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Record state change in history
    await this.historyService.recordEvent({
      workItemId: id,
      eventType: "STATE_CHANGED",
      performedById: userId,
      previousState: workItem.currentState,
      newState: transitionDto.newState,
      details: transitionDto.reason,
    })

    return updated
  }

  async blockWorkItem(id: string, blockDto: BlockWorkItemDto, userId: string, userRole: UserRole) {
    // Authorization check
    const workItem = await this.findById(id, userId, userRole)

    // Only ADMIN and OPERATOR can block
    if (userRole === "VIEWER") {
      throw new ForbiddenException("Viewers cannot block work items")
    }

    if (workItem.isBlocked) {
      throw new BadRequestException("Work item is already blocked")
    }

    const updated = await this.prisma.workItem.update({
      where: { id },
      data: {
        isBlocked: true,
        blockedReason: blockDto.reason,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Record blocking in history
    await this.historyService.recordEvent({
      workItemId: id,
      eventType: "BLOCKED",
      performedById: userId,
      details: blockDto.reason,
    })

    return updated
  }

  async unblockWorkItem(id: string, userId: string, userRole: UserRole) {
    // Authorization check
    const workItem = await this.findById(id, userId, userRole)

    // Only ADMIN and OPERATOR can unblock
    if (userRole === "VIEWER") {
      throw new ForbiddenException("Viewers cannot unblock work items")
    }

    if (!workItem.isBlocked) {
      throw new BadRequestException("Work item is not blocked")
    }

    const updated = await this.prisma.workItem.update({
      where: { id },
      data: {
        isBlocked: false,
        blockedReason: null,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Record unblocking in history
    await this.historyService.recordEvent({
      workItemId: id,
      eventType: "UNBLOCKED",
      performedById: userId,
    })

    return updated
  }

  async reworkWorkItem(id: string, reason: string, userId: string, userRole: UserRole) {
    // Authorization check
    const workItem = await this.findById(id, userId, userRole)

    // Only ADMIN and OPERATOR can initiate rework
    if (userRole === "VIEWER") {
      throw new ForbiddenException("Viewers cannot initiate rework")
    }

    const updated = await this.prisma.workItem.update({
      where: { id },
      data: {
        currentState: "REWORK",
      },
      include: {
        createdBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    // Record rework in history
    await this.historyService.recordEvent({
      workItemId: id,
      eventType: "REWORK_INITIATED",
      performedById: userId,
      newState: "REWORK",
      details: reason,
    })

    return updated
  }
}
