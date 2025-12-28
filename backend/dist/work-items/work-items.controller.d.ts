import type { WorkItemsService } from "./work-items.service";
import type { CreateWorkItemDto } from "./dto/create-work-item.dto";
import type { UpdateWorkItemDto } from "./dto/update-work-item.dto";
import type { TransitionStateDto } from "./dto/transition-state.dto";
import type { BlockWorkItemDto } from "./dto/block-work-item.dto";
import type { JwtPayload } from "../common/types";
export declare class WorkItemsController {
    private workItemsService;
    constructor(workItemsService: WorkItemsService);
    create(createDto: CreateWorkItemDto, user: JwtPayload): Promise<{
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
    findAll(user: JwtPayload): Promise<({
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
    findById(id: string, user: JwtPayload): Promise<{
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
    update(id: string, updateDto: UpdateWorkItemDto, user: JwtPayload): Promise<{
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
    transitionState(id: string, transitionDto: TransitionStateDto, user: JwtPayload): Promise<{
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
    block(id: string, blockDto: BlockWorkItemDto, user: JwtPayload): Promise<{
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
    unblock(id: string, user: JwtPayload): Promise<{
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
    rework(id: string, reason: string, user: JwtPayload): Promise<{
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
