import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserRole } from 'src/roles/roles.enum';
import { Roles } from 'src/roles/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    
    return this.authService.login(req.user);
  }

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtectedRoute(@Req() req) {
    return {
      message: 'You have access to this protected route',
      user: req.user,
    };
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // This route is only accessible by users with 'admin' role
  getAdminResource() {
    return { message: 'This is an admin-only route' };
  }

  @Get('user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER, UserRole.ADMIN) // This route is accessible by both 'user' and 'admin'
  getUserResource() {
    return { message: 'This is a user or admin route' };
  }
}
