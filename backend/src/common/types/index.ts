export type UserRole = "ADMIN" | "OPERATOR" | "VIEWER"
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED"
export type WorkItemState = "CREATED" | "IN_PROGRESS" | "IN_REVIEW" | "REWORK" | "COMPLETED"
export type HistoryEventType = "CREATED" | "STATE_CHANGED" | "BLOCKED" | "UNBLOCKED" | "REWORK_INITIATED" | "UPDATED"

export interface JwtPayload {
  sub: string
  email: string
  role: UserRole
}
