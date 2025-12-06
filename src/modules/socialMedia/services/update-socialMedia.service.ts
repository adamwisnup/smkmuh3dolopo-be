import { Injectable, NotFoundException } from "@nestjs/common";
import { SocialMediaCommandRepository } from "src/repositories/socialMedia/command.socialMedia";
import { SocialMediaQueryRepository } from "src/repositories/socialMedia/query.socialMedia";
import { AppLogger } from "../../../utils/logger";
import { UpdateSocialMediaDto } from "../dto/update-socialMedia.dto";
import { SocialMedia } from "../../../../generated/prisma";

@Injectable()
export class UpdateSocialMediaService {
  private readonly logger: AppLogger;

  constructor(
    private readonly commandRepo: SocialMediaCommandRepository,
    private readonly queryRepo: SocialMediaQueryRepository,
  ) {
    this.logger = new AppLogger('UpdateSocialMediaService');
  }

  async execute(id: string, dto: UpdateSocialMediaDto): Promise<SocialMedia> {
    try {
      this.logger.log('Service: Executing update social media', { id, dto });

      // Get existing social media first
      const existingSocialMedia = await this.queryRepo.findById(id);
      if (!existingSocialMedia) {
        throw new NotFoundException(`Social Media with ID ${id} not found`);
      }

      // Create update payload with fallback to existing values
      const updatePayload: Partial<SocialMedia> = {
        name: dto.name ?? existingSocialMedia.name,
        link: dto.link ?? existingSocialMedia.link,
      };

      const updatedSocialMedia = await this.commandRepo.update(id, updatePayload);
      this.logger.log('Service: Successfully updated social media', { id });
      return updatedSocialMedia;
    } catch (error) {
      this.logger.error('Service: Error executing update social media', { id, error });
      throw error;
    }
  }
}
