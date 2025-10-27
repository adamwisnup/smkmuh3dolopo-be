import { Injectable } from '@nestjs/common';
import { SocialMediaQueryRepository } from 'src/repositories/socialMedia/query.socialMedia';
import { SocialMedia } from '../../../../generated/prisma';
import { AppLogger } from '../../../utils/logger';

@Injectable()
export class GetByIdSocialMediaService {
  private readonly logger: AppLogger;

  constructor(private readonly queryRepo: SocialMediaQueryRepository) {
    this.logger = new AppLogger('GetByIdSocialMediaService');
  }

  async execute(id: string): Promise<SocialMedia | null> {
    try {
      this.logger.log(`Service: Executing get social media by ID: ${id}`);
      const socialMedia = await this.queryRepo.findById(id);
      if (!socialMedia) {
        this.logger.warn(`Service: Social media not found (id: ${id})`);
        return null;
      }
      this.logger.log(`Service: Successfully retrieved social media (id: ${id})`);
      return socialMedia;
    } catch (error) {
      this.logger.error(`Service: Error executing get social media by ID (id: ${id})`, error);
      throw error;
    }
  }
}