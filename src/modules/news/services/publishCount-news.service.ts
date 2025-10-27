import { Injectable } from "@nestjs/common";
import { News } from '../../../../generated/prisma';
import { AppLogger } from '../../../utils/logger';
import { NewsQueryRepository } from "src/repositories/news/query.news";


@Injectable()
export class PublishCountNewsService {
  private readonly logger: AppLogger;
  constructor(private readonly queryRepo: NewsQueryRepository) {
    this.logger = new AppLogger('PublishCountNewsService');
  }

  async execute(): Promise<number> {
    try {
      this.logger.log('Service: Executing published news count');
      const count = await this.queryRepo.publishNewsCount();
      this.logger.log(`Service: Published news count retrieved: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Service: Error executing published news count', error);
      throw error;
    }
  }
}