import { Controller, Post, HttpCode, HttpStatus, Req } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { LoginDto } from "./dto/login.dto"
import { RegisterDto } from "./dto/register.dto"
import { UsersService } from "../users/users.service"

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto)
    return {
      message: "User registered successfully",
      userId: user.id,
    }
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password)
  }
}
