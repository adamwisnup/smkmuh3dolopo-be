import { Injectable } from '@nestjs/common';
import { AdminQueryRepository } from '../../../repositories/admins/query.admin';
import { AppLogger } from '../../../utils/logger';

@Injectable()
export class GetAllAdminService {
  private readonly logger: AppLogger;

  constructor(private readonly queryRepo: AdminQueryRepository) {
    this.logger = new AppLogger('GetAllAdminService');
  }

  async execute(options: { page?: number; limit?: number } = {}) {
    try {
      this.logger.log('Service: Fetching all admins', { options });
      const result = await this.queryRepo.findAll(options);
      this.logger.log('Service: Successfully fetched admins', { count: result.data.length });
      return result;
    } catch (error) {
      this.logger.error('Service: Error fetching all admins', error);
      throw error;
    }
  }
}