import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminQueryRepository } from '../../../repositories/admins/query.admin';
import { AdminCommandRepository } from '../../../repositories/admins/command.admin';
import { AppLogger } from '../../../utils/logger';

@Injectable()
export class DeleteAdminService {
  private readonly logger: AppLogger;

  constructor(
    private readonly queryRepo: AdminQueryRepository,
    private readonly commandRepo: AdminCommandRepository,
  ) {
    this.logger = new AppLogger('DeleteAdminService');
  }

  async execute(id: string) {
    try {
      this.logger.log(`Service: Deleting admin with ID: ${id}`);

      // Check if admin exists
      const existingAdmin = await this.queryRepo.findById(id);
      if (!existingAdmin) {
        this.logger.warn(`Service: Admin not found (id: ${id})`);
        throw new NotFoundException('Admin not found');
      }

      await this.commandRepo.delete(id);

      this.logger.log(`Service: Successfully deleted admin with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Service: Error deleting admin with ID: ${id}`, error);
      throw error;
    }
  }
}