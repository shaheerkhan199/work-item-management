import type { PrismaService } from "../prisma/prisma.service";
import type { HistoryService } from "../history/history.service";
import type { CreateWorkItemDto } from "./dto/create-work-item.dto";
import type { UpdateWorkItemDto } from "./dto/update-work-item.dto";
import type { TransitionStateDto } from "./dto/transition-state.dto";
import type { BlockWorkItemDto } from "./dto/block-work-item.dto";
import type { UserRole } from "../common/types";
export declare class WorkItemsService {
    private prisma;
    private historyService;
    constructor(prisma: PrismaService, historyService: HistoryService);
    create(createDto: CreateWorkItemDto, userId: string): Promise<{
        createdBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        currentState: import("@prisma/client").$Enums.WorkItemState;
        isBlocked: boolean;
        blockedReason: string | null;
        createdById: string;
    }>;
    findAll(userId: string, userRole: UserRole): Promise<({
        createdBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        currentState: import("@prisma/client").$Enums.WorkItemState;
        isBlocked: boolean;
        blockedReason: string | null;
        createdById: string;
    })[]>;
    findById(id: string, userId: string, userRole: UserRole): Promise<{
        createdBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        currentState: import("@prisma/client").$Enums.WorkItemState;
        isBlocked: boolean;
        blockedReason: string | null;
        createdById: string;
    }>;
    update(id: string, updateDto: UpdateWorkItemDto, userId: string, userRole: UserRole): Promise<{
        createdBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        currentState: import("@prisma/client").$Enums.WorkItemState;
        isBlocked: boolean;
        blockedReason: string | null;
        createdById: string;
    }>;
    transitionState(id: string, transitionDto: TransitionStateDto, userId: string, userRole: UserRole): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        currentState: import("@prisma/client").$Enums.WorkItemState;
        isBlocked: boolean;
        blockedReason: string | null;
        createdById: string;
    }>;
    blockWorkItem(id: string, blockDto: BlockWorkItemDto, userId: string, userRole: UserRole): Promise<{
        createdBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        currentState: import("@prisma/client").$Enums.WorkItemState;
        isBlocked: boolean;
        blockedReason: string | null;
        createdById: string;
    }>;
    unblockWorkItem(id: string, userId: string, userRole: UserRole): Promise<{
        createdBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        currentState: import("@prisma/client").$Enums.WorkItemState;
        isBlocked: boolean;
        blockedReason: string | null;
        createdById: string;
    }>;
    reworkWorkItem(id: string, reason: string, userId: string, userRole: UserRole): Promise<{
        createdBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string | null;
        currentState: import("@prisma/client").$Enums.WorkItemState;
        isBlocked: boolean;
        blockedReason: string | null;
        createdById: string;
    }>;
}
