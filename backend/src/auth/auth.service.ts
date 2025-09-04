import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  private refreshTokens: Map<string, string> = new Map();
  

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) { }


  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { name: user.name, email: user.email, role: user.role, sub: user.id, tenantId: user.tenantId };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    this.refreshTokens.set(user.id, refreshToken);
    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const userId = payload.sub;
      const storedToken = this.refreshTokens.get(userId);


      if (storedToken !== refreshToken) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw new UnauthorizedException('Usuário inválido ou inativo');
      }

      const newPayload = {
        email: user.email,
        sub: user.id,
        tenantId: user.tenantId,
        role: user.role,
      };
      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: '1h',
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        expiresIn: '7d',
      });

      // Atualizar refresh token
      this.refreshTokens.set(userId, newRefreshToken);
      await this.usersService.updateRefreshToken(userId, newRefreshToken);
      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }

  async getProfile(userId: string) {
    const user = await this.usersService.findOne(userId);

    return {
      id: user.id,
      tenantId: user.tenantId,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async logout(userId: string) {
    this.refreshTokens.delete(userId);
    return { message: 'Logout realizado com sucesso' };
  }
}