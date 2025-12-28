import type { PrismaService } from "../prisma/prisma.service";
import type { RegisterDto } from "../auth/dto/register.dto";
import type { UserRole } from "../common/types";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(registerDto: RegisterDto): Promise<{
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
    findByEmail(email: string): Promise<{
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
    findById(id: string): Promise<{
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
    findAll(): Promise<{
        email: string;
        firstName: string;
        lastName: string;
        id: string;
        role: import("@prisma/client").$Enums.UserRole;
        active: boolean;
        createdAt: Date;
    }[]>;
    updateRole(id: string, role: UserRole): Promise<{
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
    deactivateUser(id: string): Promise<{
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
