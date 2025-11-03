import { Injectable } from "@nestjs/common";
import { AppLogger } from "../../../utils/logger";
import { NewsCommandRepository } from "src/repositories/news/command.news";
import { News } from "../../../../generated/prisma";
import { UpdateNewsDto } from "../dto/update-news.dto";
import imagekit from '../../../configs/imagekit.config';

@Injectable()
export class UpdateNewsService {
  private readonly logger: AppLogger;

  constructor(private readonly commandRepo: NewsCommandRepository) {
    this.logger = new AppLogger('UpdateNewsService');
  }

  async execute(id: string, dto: UpdateNewsDto): Promise<News> {
    try {
      this.logger.log('Service: Executing update news', { id });

      let photoUrl: string | undefined;

      if (dto.photo?.buffer) {
        const uploadResult = await imagekit.upload({
          file: dto.photo.buffer,
          fileName: `news-${id}-${Date.now()}`,
          folder: 'smkmuh3dlp/berita',
        });
        photoUrl = uploadResult.url;
        this.logger.log('Service: Photo uploaded to ImageKit', { url: photoUrl });
      }

      const { photo: _ignoredPhoto, ...restDto } = dto;
      const updatePayload: Partial<News> = { ...restDto };

      if (photoUrl) {
        updatePayload.photo = photoUrl;
      }

      if (dto.content) {
        const headline = dto.content.split(/(?<=[.!?])\s+/)[0];
        updatePayload.headline = headline;
      }

      const updatedNews = await this.commandRepo.update(id, updatePayload);

      this.logger.log('Service: Successfully updated news', { id });
      return updatedNews;
    } catch (error) {
      this.logger.error('Service: Error executing update news', { id, error });
      throw error;
    }
  }
}