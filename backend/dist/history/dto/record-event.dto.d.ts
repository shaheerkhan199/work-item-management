import type { HistoryEventType, WorkItemState } from "../../common/types";
export declare class RecordEventDto {
    workItemId: string;
    eventType: HistoryEventType;
    performedById: string;
    previousState?: WorkItemState;
    newState?: WorkItemState;
    details?: string;
}
