import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import * as bcrypt from "bcrypt"
import { UsersService } from "../users/users.service"
import type { JwtPayload } from "../common/types"

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user) {
      throw new UnauthorizedException("Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials")
    }

    // Only ACTIVE users can login
    if (user.status !== "ACTIVE") {
      if (user.status === "INACTIVE") {
        throw new UnauthorizedException("Your account is pending approval. Please contact an administrator.")
      }
      if (user.status === "SUSPENDED") {
        throw new UnauthorizedException("Your account has been suspended. Please contact an administrator.")
      }
      throw new UnauthorizedException("User account is not active")
    }

    return user
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password)

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    }
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token)
    } catch {
      throw new UnauthorizedException("Invalid token")
    }
  }
}
