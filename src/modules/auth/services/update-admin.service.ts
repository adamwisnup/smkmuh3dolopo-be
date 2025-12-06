import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { AdminQueryRepository } from '../../../repositories/admins/query.admin';
import { AdminCommandRepository } from '../../../repositories/admins/command.admin';
import { AppLogger } from '../../../utils/logger';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { Admin, StatusUser } from '../../../../generated/prisma';
import { AdminResponse } from '../../../types/admin.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UpdateAdminService {
  private readonly logger: AppLogger;

  constructor(
    private readonly queryRepo: AdminQueryRepository,
    private readonly commandRepo: AdminCommandRepository,
  ) {
    this.logger = new AppLogger('UpdateAdminService');
  }

  async execute(id: string, dto: UpdateAdminDto): Promise<AdminResponse> {
    try {
      this.logger.log(`Service: Updating admin with ID: ${id}`);

      // Check if admin exists
      const existingAdmin = await this.queryRepo.findById(id);
      if (!existingAdmin) {
        this.logger.warn(`Service: Admin not found (id: ${id})`);
        throw new NotFoundException('Admin not found');
      }

      // If email is being updated, check if it's already taken by another admin
      if (dto.email && dto.email !== existingAdmin.email) {
        const adminWithNewEmail = await this.queryRepo.findByEmail(dto.email);
        if (adminWithNewEmail) {
          this.logger.warn(`Service: Email ${dto.email} already taken by another admin`);
          throw new ConflictException('Email already taken by another admin');
        }
      }

      // Create update payload with fallback to existing values
      const updatePayload: Partial<Admin> = {
        name: dto.name ?? existingAdmin.name,
        email: dto.email ?? existingAdmin.email,
        role: dto.role ?? existingAdmin.role,
        status: (dto.status as StatusUser) ?? existingAdmin.status,
      };

      // Hash password if provided
      if (dto.password) {
        const saltRounds = 10;
        updatePayload.password = await bcrypt.hash(dto.password, saltRounds);
      }

      const updatedAdmin = await this.commandRepo.update(id, updatePayload);

      this.logger.log(`Service: Successfully updated admin with ID: ${updatedAdmin.id}`);
      return updatedAdmin;
    } catch (error) {
      this.logger.error(`Service: Error updating admin with ID: ${id}`, error);
      throw error;
    }
  }
}