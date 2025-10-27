import { Injectable } from "@nestjs/common";
import { AppLogger } from "../../../utils/logger";
import { NewsCommandRepository } from "src/repositories/news/command.news";
import { CreateNewsDto } from "../dto/create-news.dto";
import { News } from "../../../../generated/prisma";

@Injectable()
export class CreateNewsService {
  private readonly logger: AppLogger;

  constructor(private readonly commandRepo: NewsCommandRepository) {
    this.logger = new AppLogger('CreateNewsService');
  }

  async execute(dto:CreateNewsDto): Promise<News> {
    try {
      this.logger.log('Service: Executing create news', { dto });
      const newNews = await this.commandRepo.create(dto);
      this.logger.log('Service: Successfully created news', { id: newNews.id });
      return newNews;
    } catch (error) {
      this.logger.error('Service: Error executing create news', error);
      throw error;
    }
  }
}