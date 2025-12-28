import type { JwtService } from "@nestjs/jwt";
import type { UsersService } from "../users/users.service";
import type { JwtPayload } from "../common/types";
export declare class AuthService {
    private jwtService;
    private usersService;
    constructor(jwtService: JwtService, usersService: UsersService);
    validateUser(email: string, password: string): Promise<{
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
    login(email: string, password: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.UserRole;
        };
    }>;
    verifyToken(token: string): Promise<JwtPayload>;
}
