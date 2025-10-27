import { Injectable } from "@nestjs/common";
import { AppLogger } from "../../../utils/logger";
import { NewsCommandRepository } from "src/repositories/news/command.news";
import { News } from "../../../../generated/prisma";
import { UpdateNewsDto } from "../dto/update-news.dto";

@Injectable()
export class UpdateNewsService {
  private readonly logger: AppLogger;

  constructor(private readonly commandRepo: NewsCommandRepository) {
    this.logger = new AppLogger('UpdateNewsService');
  }

  async execute(id: string, dto: UpdateNewsDto): Promise<News> {
    try {
      this.logger.log('Service: Executing update news', { id, dto });
      const updatedNews = await this.commandRepo.update(id, dto);
      this.logger.log('Service: Successfully updated news', { id });
      return updatedNews;
    } catch (error) {
      this.logger.error('Service: Error executing update news', { id, error });
      throw error;
    }
  }
}