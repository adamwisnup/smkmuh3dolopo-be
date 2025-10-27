import { Injectable } from "@nestjs/common";
import { INewsCommandRepository } from "../interface/news.repository.interface";
import { AppLogger } from '../../utils/logger';
import { News, Prisma } from "../../../generated/prisma";
import prisma from '../../configs/db.config';

@Injectable()
export class NewsCommandRepository implements INewsCommandRepository {
  private readonly logger: AppLogger;

  constructor() {
    this.logger = new AppLogger('NewsCommandRepository');
  }

  async create(data: Prisma.NewsCreateInput): Promise<News> {
    try {
      this.logger.log('Creating new news item', { title: (data as any).title });
      const newNews = await prisma.prismaClient.news.create({
        data,
      });
      this.logger.log('News item created successfully', { id: newNews.id });
      return newNews;
    } catch (error) {
      this.logger.error('Error creating news item', error);
      throw error;
    }
  }

  async update(id: string, data: Prisma.NewsUpdateInput): Promise<News> {
    try {
      this.logger.log('Updating news item', { id, dataKeys: Object.keys(data) });
      const updatedNews = await prisma.prismaClient.news.update({
        where: { id },
        data,
      });
      this.logger.log('News item updated successfully', { id });
      return updatedNews;
    } catch (error) {
      this.logger.error('Error updating news item', { id, error });
      throw error;
    }
  }

  async delete(id: string): Promise<News> {
    try {
      this.logger.log('Deleting news item', { id });
      const deletedNews = await prisma.prismaClient.news.delete({
        where: { id },
      });
      this.logger.log('News item deleted successfully', { id });
      return deletedNews;
    } catch (error) {
      this.logger.error('Error deleting news item', { id, error });
      throw error;
    }
  }
}