import { Injectable } from "@nestjs/common";
import { INewsQueryRepository } from "../interface/news.repository.interface";
import { AppLogger } from '../../utils/logger';
import { News, StatusNews } from "../../../generated/prisma";
import prisma from '../../configs/db.config';
import { defaultPaginator, generatePaginator } from '../../utils/paginator';

@Injectable()
export class NewsQueryRepository implements INewsQueryRepository {
  private readonly logger: AppLogger;

  constructor() {
    this.logger = new AppLogger('NewsQueryRepository');
  }

  async findAll(options?: { page?: number; limit?: number }): Promise<{ data: News[]; pagination: any }> {
    try {
      this.logger.log('Fetching all news with pagination', { options });
      const { page, limit, offset } = defaultPaginator(options);
      const [newsItems, totalCount] = await Promise.all([
        prisma.prismaClient.news.findMany({
          skip: offset,
          take: limit,
          orderBy: { created_at: 'desc' },
        }),
        prisma.prismaClient.news.count(),
      ]);
      
      const pagination = generatePaginator(page, limit, totalCount);
      this.logger.log('Successfully fetched news', { totalCount, pagination });
      return { data: newsItems, pagination };
    } catch (error) {
      this.logger.error('Error fetching news', error);
      throw error;
    }
  }

  async findById(id: string): Promise<News | null> {
    try {
      this.logger.debug(`Finding news by ID: ${id}`);
      const newsItem = await prisma.prismaClient.news.findUnique({
        where: { id },
      });
      if (!newsItem) {
        this.logger.warn(`News not found (id: ${id})`);
      }
      return newsItem;
    } catch (error) {
      this.logger.error('Error finding news by ID', { id, error });
      throw error;
    }
  }

  async totalNewsCount(): Promise<number> {
    try {
      this.logger.debug('Counting total news items');
      const count = await prisma.prismaClient.news.count();
      this.logger.log(`Total news count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error counting total news items', error);
      throw error;
    }
  }

  async publishNewsCount(): Promise<number> {
    try {
      this.logger.debug('Counting published news items');
      const count = await prisma.prismaClient.news.count({
        where: { status: StatusNews.PUBLISHED },
      });
      this.logger.log(`Published news count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error counting published news items', error);
      throw error;
    }
  }
}