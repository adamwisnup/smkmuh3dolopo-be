import { Injectable } from "@nestjs/common";
import { News } from '../../../../generated/prisma';
import { AppLogger } from '../../../utils/logger';
import { NewsQueryRepository } from "src/repositories/news/query.news";

@Injectable()
export class GetAllNewsService {
  private readonly logger: AppLogger;

  constructor(private readonly queryRepo: NewsQueryRepository) {
    this.logger = new AppLogger('GetAllNewsService');
  }

  async execute(options: { page?: number; limit?: number } = {}): Promise<{ data: News[]; pagination: any }> {
    try {
      this.logger.log('Service: Executing get all news', { options });
      const result = await this.queryRepo.findAll(options);
      this.logger.log('Service: Successfully retrieved news', { count: result.data.length });
      return result;
    } catch (error) {
      this.logger.error('Service: Error executing get all news', error);
      throw error;
    }
  }
}