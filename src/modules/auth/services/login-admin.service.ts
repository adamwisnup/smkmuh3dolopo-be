import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminQueryRepository } from '../../../repositories/admins/query.admin';
import { AppLogger } from '../../../utils/logger';
import { LoginAdminDto } from '../dto/login-admin.dto';
import { GenerateTokenService } from './generate-jwt.service';
import * as bcrypt from 'bcrypt';
import { StatusUser } from '../../../../generated/prisma';

@Injectable()
export class LoginAdminService {
  private readonly logger: AppLogger;

  constructor(
    private readonly queryRepo: AdminQueryRepository,
    private readonly generateTokenService: GenerateTokenService,
  ) {
    this.logger = new AppLogger('LoginAdminService');
  }

  async execute(dto: LoginAdminDto): Promise<{ token: string }> {
    try {
      this.logger.log(`Service: Executing login admin by email: ${dto.email}`);
      const admin = await this.queryRepo.findByEmail(dto.email);

      if (!admin) {
        this.logger.warn(`Service: Admin not found (email: ${dto.email})`);
        throw new UnauthorizedException('Invalid email or password');
      }

      if (admin.status !== StatusUser.ACTIVE) {
        this.logger.warn(`Service: Admin is inactive (email: ${dto.email})`);
        throw new UnauthorizedException('Admin account is inactive');
      }

      const isPasswordValid = await bcrypt.compare(dto.password, admin.password);
      if (!isPasswordValid) {
        this.logger.warn(`Service: Invalid password for email: ${dto.email}`);
        throw new UnauthorizedException('Invalid email or password');
      }

      const token = this.generateTokenService.execute({
        id: admin.id,
        email: admin.email,
      });

      this.logger.log(`Service: Login successful, token generated for admin (email: ${dto.email})`);
      return { token };
    } catch (error) {
      this.logger.error(`Service: Error executing login admin by email (email: ${dto.email})`, error);
      throw error;
    }
  }
}