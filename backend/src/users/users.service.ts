import { Injectable, ConflictException } from "@nestjs/common"
import * as bcrypt from "bcrypt"
import { PrismaService } from "../prisma/prisma.service"
import { RegisterDto } from "../auth/dto/register.dto"
import type { UserRole, UserStatus } from "../common/types"

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    })

    if (existingUser) {
      throw new ConflictException("Email already in use")
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10)

    return this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: "VIEWER" as UserRole, // Default role for new users
        status: "INACTIVE" as UserStatus, // New users are inactive until approved by admin
      },
    })
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        status: true,
        createdAt: true,
      },
    })
  }

  async updateRole(id: string, role: UserRole) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    })
  }

  async updateStatus(id: string, status: UserStatus) {
    return this.prisma.user.update({
      where: { id },
      data: { status },
    })
  }
}
