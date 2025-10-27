import { Injectable } from "@nestjs/common";
import { News } from '../../../../generated/prisma';
import { AppLogger } from '../../../utils/logger';
import { NewsQueryRepository } from "src/repositories/news/query.news";

@Injectable()
export class TotalCountNewsService {
  private readonly logger: AppLogger;
  constructor(private readonly queryRepo: NewsQueryRepository) {
    this.logger = new AppLogger('TotalCountNewsService');
  }

  async execute(): Promise<number> {
    try {
      this.logger.log('Service: Executing total news count');
      const count = await this.queryRepo.totalNewsCount();
      this.logger.log(`Service: Total news count retrieved: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Service: Error executing total news count', error);
      throw error;
    }
  }
}