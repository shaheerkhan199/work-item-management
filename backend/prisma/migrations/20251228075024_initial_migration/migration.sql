-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'OPERATOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "WorkItemState" AS ENUM ('CREATED', 'IN_PROGRESS', 'IN_REVIEW', 'REWORK', 'COMPLETED');

-- CreateEnum
CREATE TYPE "HistoryEventType" AS ENUM ('CREATED', 'STATE_CHANGED', 'BLOCKED', 'UNBLOCKED', 'REWORK_INITIATED', 'UPDATED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "currentState" "WorkItemState" NOT NULL DEFAULT 'CREATED',
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "blockedReason" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history_events" (
    "id" TEXT NOT NULL,
    "workItemId" TEXT NOT NULL,
    "eventType" "HistoryEventType" NOT NULL,
    "previousState" "WorkItemState",
    "newState" "WorkItemState",
    "details" TEXT,
    "performedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "history_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "work_items_createdById_idx" ON "work_items"("createdById");

-- CreateIndex
CREATE INDEX "work_items_currentState_idx" ON "work_items"("currentState");

-- CreateIndex
CREATE INDEX "history_events_workItemId_idx" ON "history_events"("workItemId");

-- CreateIndex
CREATE INDEX "history_events_performedById_idx" ON "history_events"("performedById");

-- CreateIndex
CREATE INDEX "history_events_eventType_idx" ON "history_events"("eventType");

-- AddForeignKey
ALTER TABLE "work_items" ADD CONSTRAINT "work_items_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_events" ADD CONSTRAINT "history_events_workItemId_fkey" FOREIGN KEY ("workItemId") REFERENCES "work_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "history_events" ADD CONSTRAINT "history_events_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
