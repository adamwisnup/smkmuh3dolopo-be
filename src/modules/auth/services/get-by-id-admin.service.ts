import { Injectable, NotFoundException } from '@nestjs/common';
import { AdminQueryRepository } from '../../../repositories/admins/query.admin';
import { AppLogger } from '../../../utils/logger';

@Injectable()
export class GetByIdAdminService {
  private readonly logger: AppLogger;

  constructor(private readonly queryRepo: AdminQueryRepository) {
    this.logger = new AppLogger('GetByIdAdminService');
  }

  async execute(id: string) {
    try {
      this.logger.log(`Service: Fetching admin with ID: ${id}`);
      const admin = await this.queryRepo.findById(id);

      if (!admin) {
        this.logger.warn(`Service: Admin not found (id: ${id})`);
        throw new NotFoundException('Admin not found');
      }

      this.logger.log(`Service: Successfully fetched admin with ID: ${id}`);
      return admin;
    } catch (error) {
      this.logger.error(`Service: Error fetching admin with ID: ${id}`, error);
      throw error;
    }
  }
}