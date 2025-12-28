export type UserRole = "ADMIN" | "OPERATOR" | "VIEWER"
export type WorkItemState = "CREATED" | "IN_PROGRESS" | "IN_REVIEW" | "REWORK" | "COMPLETED"
export type HistoryEventType = "CREATED" | "STATE_CHANGED" | "BLOCKED" | "UNBLOCKED" | "REWORK_INITIATED" | "UPDATED"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  active?: boolean
  createdAt?: string
}

export interface WorkItem {
  id: string
  title: string
  description?: string
  currentState: WorkItemState
  isBlocked: boolean
  blockedReason?: string
  createdAt: string
  updatedAt: string
  createdBy: User
}

export interface HistoryEvent {
  id: string
  workItemId: string
  workItem?: {
    id: string
    title: string
    currentState: WorkItemState
  }
  eventType: HistoryEventType
  previousState?: WorkItemState
  newState?: WorkItemState
  details?: string
  performedById: string
  performedBy: User
  createdAt: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}
