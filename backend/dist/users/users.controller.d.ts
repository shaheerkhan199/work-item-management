import type { UsersService } from "./users.service";
import type { JwtPayload } from "../common/types";
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getCurrentUser(user: JwtPayload): Promise<{
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getAllUsers(): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        active: boolean;
        createdAt: Date;
    }[]>;
    updateUserRole(id: string, role: string): Promise<{
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
