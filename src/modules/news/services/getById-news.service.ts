import { Injectable } from "@nestjs/common";
import { News } from '../../../../generated/prisma';
import { AppLogger } from '../../../utils/logger';
import { NewsQueryRepository } from "src/repositories/news/query.news";

@Injectable()
export class GetByIdNewsService {
  private readonly logger: AppLogger;

  constructor(private readonly queryRepo: NewsQueryRepository) {
    this.logger = new AppLogger('GetByIdNewsService');
  }

  async execute(id: string): Promise<News | null> {
    try {
      this.logger.log(`Service: Executing get news by ID: ${id}`);
      const news = await this.queryRepo.findById(id);
      if (!news) {
        this.logger.warn(`Service: News not found (id: ${id})`);
        return null;
      }
      this.logger.log(`Service: Successfully retrieved news (id: ${id})`);
      return news;
    }catch (error) {
      this.logger.error(`Service: Error executing get news by ID (id: ${id})`, error);
      throw error;
    }
  }
}