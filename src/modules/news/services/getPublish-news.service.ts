import { Injectable } from "@nestjs/common";
import { News } from '../../../../generated/prisma';
import { AppLogger } from '../../../utils/logger';
import { NewsQueryRepository } from "src/repositories/news/query.news";

@Injectable()
export class GetPublishNewsService {
  private readonly logger: AppLogger;
  constructor(private readonly queryRepo: NewsQueryRepository) {
    this.logger = new AppLogger('GetPublishNewsService');
  }

  async execute(options: { page?: number; limit?: number } = {}): Promise<{ data: News[]; pagination: any }> {
    try {
      this.logger.log('Service: Executing get published news', { options });
      const result = await this.queryRepo.findPublishedNews(options);
      this.logger.log('Service: Successfully retrieved published news', { count: result.data.length });
      return result;
    } catch (error) {
      this.logger.error('Service: Error executing get published news', error);
      throw error;
    }
  }
}