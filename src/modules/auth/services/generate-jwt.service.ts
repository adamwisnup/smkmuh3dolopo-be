import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class GenerateTokenService {
  constructor(private readonly jwtService: JwtService) {}

  execute(payload: { id: string; email: string }): string {
    return this.jwtService.sign(payload);
  }
}