import type { HistoryService } from "./history.service";
import type { JwtPayload } from "../common/types";
export declare class HistoryController {
    private historyService;
    constructor(historyService: HistoryService);
    getWorkItemHistory(workItemId: string, user: JwtPayload): Promise<({
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
    getUserActivity(limit?: string, user: JwtPayload): Promise<({
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
    getAllHistory(limit?: string): Promise<({
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
