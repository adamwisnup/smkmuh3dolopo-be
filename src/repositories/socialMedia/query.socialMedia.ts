import { Injectable } from "@nestjs/common";
import { ISocialMediaQueryRepository } from "../interface/socialMedia.repository.interface";
import { AppLogger } from '../../utils/logger';
import { SocialMedia } from '../../../generated/prisma';
import { defaultPaginator, generatePaginator } from '../../utils/paginator';
import prisma from '../../configs/db.config';

@Injectable()
export class SocialMediaQueryRepository implements ISocialMediaQueryRepository {
  private readonly logger: AppLogger;

  constructor() {
    this.logger = new AppLogger('SocialMediaQueryRepository');
  }

  async findAll(options?: { page?: number; limit?: number }): Promise<{ data: SocialMedia[]; pagination: any }> {
    try {
      this.logger.log('Fetching all social media with pagination', { options });
      const { page, limit, offset } = defaultPaginator(options);
      const [socialMedias, totalCount] = await Promise.all([
        prisma.prismaClient.socialMedia.findMany({
          skip: offset,
          take: limit,
          orderBy: { created_at: 'desc' },
        }),
        prisma.prismaClient.socialMedia.count(),
      ]);

      const pagination = generatePaginator(page, limit, totalCount);

      this.logger.log('Successfully fetched social media', { totalCount, pagination });
      return { data: socialMedias, pagination };
    } catch (error) {
      this.logger.error('Error fetching social media', error);
      throw error;
    }
  }

  async findById(id: string): Promise<SocialMedia | null> {
    try {
      this.logger.debug(`Finding social media by ID: ${id}`);
      const socialMedia = await prisma.prismaClient.socialMedia.findUnique({
        where: { id },
      });
      if (!socialMedia) {
        this.logger.warn(`Social media not found (id: ${id})`);
      }
      return socialMedia;
    } catch (error) {
      this.logger.error('Error finding social media by ID', { id, error });
      throw error;
    }
  }
}