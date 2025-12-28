"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkItemsController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
let WorkItemsController = (() => {
    let _classDecorators = [(0, common_1.Controller)("work-items"), (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _create_decorators;
    let _findAll_decorators;
    let _findById_decorators;
    let _update_decorators;
    let _transitionState_decorators;
    let _block_decorators;
    let _unblock_decorators;
    let _rework_decorators;
    var WorkItemsController = _classThis = class {
        constructor(workItemsService) {
            this.workItemsService = (__runInitializers(this, _instanceExtraInitializers), workItemsService);
        }
        create(createDto, user) {
            return this.workItemsService.create(createDto, user.sub);
        }
        findAll(user) {
            return this.workItemsService.findAll(user.sub, user.role);
        }
        findById(id, user) {
            return this.workItemsService.findById(id, user.sub, user.role);
        }
        update(id, updateDto, user) {
            return this.workItemsService.update(id, updateDto, user.sub, user.role);
        }
        transitionState(id, transitionDto, user) {
            return this.workItemsService.transitionState(id, transitionDto, user.sub, user.role);
        }
        block(id, blockDto, user) {
            return this.workItemsService.blockWorkItem(id, blockDto, user.sub, user.role);
        }
        unblock(id, user) {
            return this.workItemsService.unblockWorkItem(id, user.sub, user.role);
        }
        rework(id, reason, user) {
            return this.workItemsService.reworkWorkItem(id, reason, user.sub, user.role);
        }
    };
    __setFunctionName(_classThis, "WorkItemsController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, roles_decorator_1.Roles)("ADMIN", "OPERATOR", "VIEWER")];
        _findAll_decorators = [(0, common_1.Get)(), (0, roles_decorator_1.Roles)("ADMIN", "OPERATOR", "VIEWER")];
        _findById_decorators = [(0, common_1.Get)(":id"), (0, roles_decorator_1.Roles)("ADMIN", "OPERATOR", "VIEWER")];
        _update_decorators = [(0, common_1.Patch)(":id"), (0, roles_decorator_1.Roles)("ADMIN", "OPERATOR")];
        _transitionState_decorators = [(0, common_1.Post)(":id/transition"), (0, roles_decorator_1.Roles)("ADMIN", "OPERATOR")];
        _block_decorators = [(0, common_1.Post)(":id/block"), (0, roles_decorator_1.Roles)("ADMIN", "OPERATOR")];
        _unblock_decorators = [(0, common_1.Post)(":id/unblock"), (0, roles_decorator_1.Roles)("ADMIN", "OPERATOR")];
        _rework_decorators = [(0, common_1.Post)(":id/rework"), (0, roles_decorator_1.Roles)("ADMIN", "OPERATOR")];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: obj => "create" in obj, get: obj => obj.create }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: obj => "findAll" in obj, get: obj => obj.findAll }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findById_decorators, { kind: "method", name: "findById", static: false, private: false, access: { has: obj => "findById" in obj, get: obj => obj.findById }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: obj => "update" in obj, get: obj => obj.update }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _transitionState_decorators, { kind: "method", name: "transitionState", static: false, private: false, access: { has: obj => "transitionState" in obj, get: obj => obj.transitionState }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _block_decorators, { kind: "method", name: "block", static: false, private: false, access: { has: obj => "block" in obj, get: obj => obj.block }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _unblock_decorators, { kind: "method", name: "unblock", static: false, private: false, access: { has: obj => "unblock" in obj, get: obj => obj.unblock }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _rework_decorators, { kind: "method", name: "rework", static: false, private: false, access: { has: obj => "rework" in obj, get: obj => obj.rework }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkItemsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkItemsController = _classThis;
})();
exports.WorkItemsController = WorkItemsController;
//# sourceMappingURL=work-items.controller.js.map