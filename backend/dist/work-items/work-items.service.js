"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkItemsService = void 0;
const common_1 = require("@nestjs/common");
// Define allowed state transitions
const ALLOWED_TRANSITIONS = {
    CREATED: ["IN_PROGRESS"],
    IN_PROGRESS: ["IN_REVIEW", "REWORK"],
    IN_REVIEW: ["COMPLETED", "REWORK"],
    REWORK: ["IN_PROGRESS", "IN_REVIEW"],
    COMPLETED: [], // Terminal state
};
let WorkItemsService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var WorkItemsService = _classThis = class {
        constructor(prisma, historyService) {
            this.prisma = prisma;
            this.historyService = historyService;
        }
        async create(createDto, userId) {
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
            });
            // Record creation in history
            await this.historyService.recordEvent({
                workItemId: workItem.id,
                eventType: "CREATED",
                performedById: userId,
                newState: "CREATED",
            });
            return workItem;
        }
        async findAll(userId, userRole) {
            // VIEWER and OPERATOR can only see work items they created
            const where = userRole === "ADMIN"
                ? {}
                : {
                    createdById: userId,
                };
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
            });
        }
        async findById(id, userId, userRole) {
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
            });
            if (!workItem) {
                throw new common_1.NotFoundException(`Work item ${id} not found`);
            }
            // Check authorization
            if (userRole !== "ADMIN" && workItem.createdById !== userId) {
                throw new common_1.ForbiddenException("You do not have access to this work item");
            }
            return workItem;
        }
        async update(id, updateDto, userId, userRole) {
            // Authorization check
            const workItem = await this.findById(id, userId, userRole);
            // Only ADMIN and OPERATOR can update
            if (userRole === "VIEWER") {
                throw new common_1.ForbiddenException("Viewers cannot update work items");
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
            });
            // Record update in history
            await this.historyService.recordEvent({
                workItemId: id,
                eventType: "UPDATED",
                performedById: userId,
                details: JSON.stringify(updateDto),
            });
            return updated;
        }
        async transitionState(id, transitionDto, userId, userRole) {
            // Authorization check
            const workItem = await this.findById(id, userId, userRole);
            // Only ADMIN and OPERATOR can transition states
            if (userRole === "VIEWER") {
                throw new common_1.ForbiddenException("Viewers cannot change work item states");
            }
            // Check if work item is blocked
            if (workItem.isBlocked) {
                throw new common_1.BadRequestException(`Work item is blocked. Reason: ${workItem.blockedReason || "No reason provided"}`);
            }
            // Validate state transition
            const allowedNextStates = ALLOWED_TRANSITIONS[workItem.currentState];
            if (!allowedNextStates.includes(transitionDto.newState)) {
                throw new common_1.BadRequestException(`Cannot transition from ${workItem.currentState} to ${transitionDto.newState}. Allowed states: ${allowedNextStates.join(", ")}`);
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
            });
            // Record state change in history
            await this.historyService.recordEvent({
                workItemId: id,
                eventType: "STATE_CHANGED",
                performedById: userId,
                previousState: workItem.currentState,
                newState: transitionDto.newState,
                details: transitionDto.reason,
            });
            return updated;
        }
        async blockWorkItem(id, blockDto, userId, userRole) {
            // Authorization check
            const workItem = await this.findById(id, userId, userRole);
            // Only ADMIN and OPERATOR can block
            if (userRole === "VIEWER") {
                throw new common_1.ForbiddenException("Viewers cannot block work items");
            }
            if (workItem.isBlocked) {
                throw new common_1.BadRequestException("Work item is already blocked");
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
            });
            // Record blocking in history
            await this.historyService.recordEvent({
                workItemId: id,
                eventType: "BLOCKED",
                performedById: userId,
                details: blockDto.reason,
            });
            return updated;
        }
        async unblockWorkItem(id, userId, userRole) {
            // Authorization check
            const workItem = await this.findById(id, userId, userRole);
            // Only ADMIN and OPERATOR can unblock
            if (userRole === "VIEWER") {
                throw new common_1.ForbiddenException("Viewers cannot unblock work items");
            }
            if (!workItem.isBlocked) {
                throw new common_1.BadRequestException("Work item is not blocked");
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
            });
            // Record unblocking in history
            await this.historyService.recordEvent({
                workItemId: id,
                eventType: "UNBLOCKED",
                performedById: userId,
            });
            return updated;
        }
        async reworkWorkItem(id, reason, userId, userRole) {
            // Authorization check
            const workItem = await this.findById(id, userId, userRole);
            // Only ADMIN and OPERATOR can initiate rework
            if (userRole === "VIEWER") {
                throw new common_1.ForbiddenException("Viewers cannot initiate rework");
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
            });
            // Record rework in history
            await this.historyService.recordEvent({
                workItemId: id,
                eventType: "REWORK_INITIATED",
                performedById: userId,
                newState: "REWORK",
                details: reason,
            });
            return updated;
        }
    };
    __setFunctionName(_classThis, "WorkItemsService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkItemsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkItemsService = _classThis;
})();
exports.WorkItemsService = WorkItemsService;
//# sourceMappingURL=work-items.service.js.map