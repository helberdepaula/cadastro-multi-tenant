import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Request,
  UseGuards,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiProperty,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IsString, IsEmail } from 'class-validator';

class LoginDto {
  @ApiProperty({
    description: 'Endereço de email do usuário',
    example: 'admin@clinica.com',
  })
  @IsEmail({}, { message: 'Email deve ser válido' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'admin123' })
  @IsString({ message: 'Senha deve ser uma string' })
  password: string;
}

class RefreshTokenDto {
  @ApiProperty({
    description: 'Token de atualização (refresh token)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  refreshToken: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Fazer login e obter token JWT' })
  @ApiResponse({ status: 200, description: 'Token JWT retornado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Patch('refresh')
  @HttpCode(200)
  @ApiOperation({ summary: 'Renovar token JWT usando refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Novo token JWT retornado com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Refresh token inválido' })
  refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil do usuário retornado com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Fazer logout e invalidar token' })
  @ApiResponse({ status: 200, description: 'Logout realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }
}
