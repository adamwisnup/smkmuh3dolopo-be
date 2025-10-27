import { Injectable } from '@nestjs/common';
import { SocialMedia, Prisma } from '../../../generated/prisma';
import prisma from '../../configs/db.config';
import { AppLogger } from '../../utils/logger';
import { ISocialMediaCommandRepository } from '../interface/socialMedia.repository.interface';

@Injectable()
export class SocialMediaCommandRepository implements ISocialMediaCommandRepository {
  private readonly logger: AppLogger;

  constructor() {
    this.logger = new AppLogger('SocialMediaCommandRepository');
  }

  async create(data: Prisma.SocialMediaCreateInput): Promise<SocialMedia> {
    try {
      this.logger.log('Creating new social media', { name: (data as any).name });
      const newSocialMedia = await prisma.prismaClient.socialMedia.create({
        data,
      });
      this.logger.log('Social media created successfully', { id: newSocialMedia.id });
      return newSocialMedia;
    } catch (error) {
      this.logger.error('Error creating social media', error);
      throw error;
    }
  }

  async update(id: string, data: Prisma.SocialMediaUpdateInput): Promise<SocialMedia> {
    try {
      this.logger.log('Updating social media', { id, dataKeys: Object.keys(data) });
      const updatedSocialMedia = await prisma.prismaClient.socialMedia.update({
        where: { id },
        data,
      });
      this.logger.log('Social media updated successfully', { id });
      return updatedSocialMedia;
    } catch (error) {
      this.logger.error('Error updating social media', { id, error });
      throw error;
    }
  }

  async delete(id: string): Promise<SocialMedia> {
    try {
      this.logger.log('Deleting social media', { id });
      const deletedSocialMedia = await prisma.prismaClient.socialMedia.delete({
        where: { id },
      });
      this.logger.log('Social media deleted successfully', { id });
      return deletedSocialMedia;
    } catch (error) {
      this.logger.error('Error deleting social media', { id, error });
      throw error;
    }
  }
}