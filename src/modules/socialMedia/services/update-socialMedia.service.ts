import { Injectable } from "@nestjs/common";
import { SocialMediaCommandRepository } from "src/repositories/socialMedia/command.socialMedia";
import { AppLogger } from "../../../utils/logger";
import { UpdateSocialMediaDto } from "../dto/update-socialMedia.dto";
import { SocialMedia } from "../../../../generated/prisma";

@Injectable()
export class UpdateSocialMediaService {
  private readonly logger: AppLogger;

  constructor(private readonly commandRepo: SocialMediaCommandRepository) {
    this.logger = new AppLogger('UpdateSocialMediaService');
  }

  async execute(id: string, dto: UpdateSocialMediaDto): Promise<SocialMedia> {
    try {
      this.logger.log('Service: Executing update social media', { id, dto });
      const updatedSocialMedia = await this.commandRepo.update(id, dto);
      this.logger.log('Service: Successfully updated social media', { id });
      return updatedSocialMedia;
    } catch (error) {
      this.logger.error('Service: Error executing update social media', { id, error });
      throw error;
    }
  }
}
