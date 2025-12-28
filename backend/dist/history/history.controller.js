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
exports.HistoryController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_guard_1 = require("../common/guards/roles.guard");
let HistoryController = (() => {
    let _classDecorators = [(0, common_1.Controller)("history"), (0, common_1.UseGuards)((0, passport_1.AuthGuard)("jwt"), roles_guard_1.RolesGuard)];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _getWorkItemHistory_decorators;
    let _getUserActivity_decorators;
    let _getAllHistory_decorators;
    var HistoryController = _classThis = class {
        constructor(historyService) {
            this.historyService = (__runInitializers(this, _instanceExtraInitializers), historyService);
        }
        getWorkItemHistory(workItemId, user) {
            return this.historyService.getWorkItemHistory(workItemId, user.sub, user.role);
        }
        getUserActivity(limit, user) {
            const limitNum = limit ? Number.parseInt(limit, 10) : 50;
            return this.historyService.getUserActivity(user.sub, limitNum);
        }
        getAllHistory(limit) {
            const limitNum = limit ? Number.parseInt(limit, 10) : 100;
            return this.historyService.getAllHistory(limitNum);
        }
    };
    __setFunctionName(_classThis, "HistoryController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getWorkItemHistory_decorators = [(0, common_1.Get)("work-item/:workItemId"), (0, roles_decorator_1.Roles)("ADMIN", "OPERATOR", "VIEWER")];
        _getUserActivity_decorators = [(0, common_1.Get)("user/me"), (0, roles_decorator_1.Roles)("ADMIN", "OPERATOR", "VIEWER")];
        _getAllHistory_decorators = [(0, common_1.Get)("all"), (0, roles_decorator_1.Roles)("ADMIN")];
        __esDecorate(_classThis, null, _getWorkItemHistory_decorators, { kind: "method", name: "getWorkItemHistory", static: false, private: false, access: { has: obj => "getWorkItemHistory" in obj, get: obj => obj.getWorkItemHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getUserActivity_decorators, { kind: "method", name: "getUserActivity", static: false, private: false, access: { has: obj => "getUserActivity" in obj, get: obj => obj.getUserActivity }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAllHistory_decorators, { kind: "method", name: "getAllHistory", static: false, private: false, access: { has: obj => "getAllHistory" in obj, get: obj => obj.getAllHistory }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        HistoryController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return HistoryController = _classThis;
})();
exports.HistoryController = HistoryController;
//# sourceMappingURL=history.controller.js.map