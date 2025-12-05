import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { AdminQueryRepository } from '../../../repositories/admins/query.admin';
import { AdminCommandRepository } from '../../../repositories/admins/command.admin';
import { AppLogger } from '../../../utils/logger';
import { UpdateAdminDto } from '../dto/update-admin.dto';

@Injectable()
export class UpdateAdminService {
  private readonly logger: AppLogger;

  constructor(
    private readonly queryRepo: AdminQueryRepository,
    private readonly commandRepo: AdminCommandRepository,
  ) {
    this.logger = new AppLogger('UpdateAdminService');
  }

  async execute(id: string, dto: UpdateAdminDto) {
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

      const updatedAdmin = await this.commandRepo.update(id, dto);

      this.logger.log(`Service: Successfully updated admin with ID: ${updatedAdmin.id}`);
      return updatedAdmin;
    } catch (error) {
      this.logger.error(`Service: Error updating admin with ID: ${id}`, error);
      throw error;
    }
  }
}