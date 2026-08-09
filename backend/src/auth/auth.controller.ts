import { Controller, Post, Body, Get, Param, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto, UpdateProfileDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('guest')
  async loginAsGuest() {
    return this.authService.loginAsGuest();
  }

  @Public()
  @Post('google')
  async loginWithGoogle(@Body() body: { email?: string; name?: string; avatar?: string }) {
    return this.authService.loginWithGoogle(body?.email, body?.name, body?.avatar);
  }

  @Get('me')
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getUserById(user.id);
  }

  @Get('me/:id')
  async getUserById(@Param('id') id: string) {
    return this.authService.getUserById(id);
  }

  @Put('profile/:id')
  async updateProfile(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(id, dto);
  }
}
