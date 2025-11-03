import { Injectable } from "@nestjs/common";
import { AppLogger } from "../../../utils/logger";
import { NewsCommandRepository } from "src/repositories/news/command.news";
import { CreateNewsDto } from "../dto/create-news.dto";
import { News } from "../../../../generated/prisma";
import imagekit from '../../../configs/imagekit.config';

@Injectable()
export class CreateNewsService {
  private readonly logger: AppLogger;

  constructor(private readonly commandRepo: NewsCommandRepository) {
    this.logger = new AppLogger('CreateNewsService');
  }

  async execute(dto: CreateNewsDto): Promise<News> {
    try {
      this.logger.log('Service: Executing create news', { title: dto.title });

      let photoUrl: string | undefined;
      if (dto.photo && dto.photo.buffer) {
        const uploadResult = await imagekit.upload({
          file: dto.photo.buffer,
          fileName: `news-${Date.now()}`,
          folder: 'smkmuh3dlp/berita',
        });
        photoUrl = uploadResult.url;
        this.logger.log('Service: Photo uploaded to ImageKit', { url: photoUrl });
      }

      const headline = dto.content.split(/(?<=[.!?])\s+/)[0];

      const newNews = await this.commandRepo.create({
        title: dto.title,
        content: dto.content,
        status: dto.status,
        photo: photoUrl,
        headline,
      });

      this.logger.log('Service: Successfully created news', { id: newNews.id });
      return newNews;
    } catch (error) {
      this.logger.error('Service: Error executing create news', error);
      throw error;
    }
  }
}