import { Injectable } from "@nestjs/common";
import { Career } from '../../../../generated/prisma';
import { AppLogger } from '../../../utils/logger';
import { CareerQueryRepository } from "src/repositories/careers/query.career";

@Injectable()
export class GetAllCareerService {
  private readonly logger: AppLogger;

  constructor(private readonly queryRepo: CareerQueryRepository) {
    this.logger = new AppLogger('GetAllCareerService');
  }

  async execute(options: { page?: number; limit?: number } = {}): Promise<{ data: Career[]; pagination: any }> {
    try {
      this.logger.log('Service: Executing get all careers', { options });
      const result = await this.queryRepo.findAll(options);
      this.logger.log('Service: Successfully retrieved careers', { count: result.data.length });
      return result;
    } catch (error) {
      this.logger.error('Service: Error executing get all careers', error);
      throw error;
    }
  }
}