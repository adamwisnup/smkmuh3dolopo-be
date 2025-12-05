import { Injectable, ConflictException } from '@nestjs/common';
import { AdminQueryRepository } from '../../../repositories/admins/query.admin';
import { AdminCommandRepository } from '../../../repositories/admins/command.admin';
import { AppLogger } from '../../../utils/logger';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { AdminRole } from '../../../../generated/prisma';

@Injectable()
export class CreateAdminService {
  private readonly logger: AppLogger;

  constructor(
    private readonly queryRepo: AdminQueryRepository,
    private readonly commandRepo: AdminCommandRepository,
  ) {
    this.logger = new AppLogger('CreateAdminService');
  }

  async execute(dto: CreateAdminDto) {
    try {
      this.logger.log(`Service: Creating new admin with email: ${dto.email}`);

      // Check if admin with this email already exists
      const existingAdmin = await this.queryRepo.findByEmail(dto.email);
      if (existingAdmin) {
        this.logger.warn(`Service: Admin with email ${dto.email} already exists`);
        throw new ConflictException('Admin with this email already exists');
      }

      const newAdmin = await this.commandRepo.create(dto);

      this.logger.log(`Service: Successfully created admin with ID: ${newAdmin.id}`);
      return newAdmin;
    } catch (error) {
      this.logger.error(`Service: Error creating admin with email: ${dto.email}`, error);
      throw error;
    }
  }
}