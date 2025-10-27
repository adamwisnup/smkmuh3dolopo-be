import { Injectable } from '@nestjs/common';
import { SocialMediaQueryRepository } from 'src/repositories/socialMedia/query.socialMedia';
import { SocialMedia } from '../../../../generated/prisma';
import { AppLogger } from '../../../utils/logger';

@Injectable()
export class GetAllSocialMediaService {
  private readonly logger: AppLogger;

  constructor(private readonly queryRepo: SocialMediaQueryRepository) {
    this.logger = new AppLogger('GetAllSocialMediaService');
  }

  async execute(options: { page?: number; limit?: number } = {}): Promise<{ data: SocialMedia[]; pagination: any }> {
    try {
      this.logger.log('Service: Executing get all social media', { options });
      const result = await this.queryRepo.findAll(options);
      this.logger.log('Service: Successfully retrieved social media', { count: result.data.length });
      return result;
    } catch (error) {
      this.logger.error('Service: Error executing get all social media', error);
      throw error;
    }
  }
}