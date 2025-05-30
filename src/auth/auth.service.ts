// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // usuario de prueba
  private readonly user = {
    id: 1,
    username: 'admin',
    password: 'admin123',   // en producción jamás así; usa hash!
  };

  constructor(private readonly jwtService: JwtService) {}

  async login(credentials: { username: string; password: string }) {
    const { username, password } = credentials;
    if (
      username !== this.user.username ||
      password !== this.user.password
    ) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // payload mínimo: sub = user.id
    const payload = { sub: this.user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
