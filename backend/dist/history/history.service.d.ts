import type { PrismaService } from "../prisma/prisma.service";
import type { RecordEventDto } from "./dto/record-event.dto";
import type { UserRole } from "../common/types";
export declare class HistoryService {
    private prisma;
    constructor(prisma: PrismaService);
    recordEvent(eventDto: RecordEventDto): Promise<{
        performedBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        eventType: import("@prisma/client").$Enums.HistoryEventType;
        previousState: import("@prisma/client").$Enums.WorkItemState | null;
        newState: import("@prisma/client").$Enums.WorkItemState | null;
        details: string | null;
        workItemId: string;
        performedById: string;
    }>;
    getWorkItemHistory(workItemId: string, userId: string, userRole: UserRole): Promise<({
        performedBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        eventType: import("@prisma/client").$Enums.HistoryEventType;
        previousState: import("@prisma/client").$Enums.WorkItemState | null;
        newState: import("@prisma/client").$Enums.WorkItemState | null;
        details: string | null;
        workItemId: string;
        performedById: string;
    })[]>;
    getUserActivity(userId: string, limit?: number): Promise<({
        workItem: {
            id: string;
            title: string;
            currentState: import("@prisma/client").$Enums.WorkItemState;
        };
        performedBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        eventType: import("@prisma/client").$Enums.HistoryEventType;
        previousState: import("@prisma/client").$Enums.WorkItemState | null;
        newState: import("@prisma/client").$Enums.WorkItemState | null;
        details: string | null;
        workItemId: string;
        performedById: string;
    })[]>;
    getAllHistory(limit?: number): Promise<({
        workItem: {
            id: string;
            title: string;
            currentState: import("@prisma/client").$Enums.WorkItemState;
        };
        performedBy: {
            email: string;
            firstName: string;
            lastName: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        eventType: import("@prisma/client").$Enums.HistoryEventType;
        previousState: import("@prisma/client").$Enums.WorkItemState | null;
        newState: import("@prisma/client").$Enums.WorkItemState | null;
        details: string | null;
        workItemId: string;
        performedById: string;
    })[]>;
}
