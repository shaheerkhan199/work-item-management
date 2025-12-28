import { Strategy } from "passport-jwt";
import type { JwtPayload } from "../../common/types";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: JwtPayload): {
        id: string;
        email: string;
        role: import("../../common/types").UserRole;
    };
}
export {};
