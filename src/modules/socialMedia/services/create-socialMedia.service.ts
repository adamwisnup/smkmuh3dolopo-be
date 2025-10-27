import { Injectable } from "@nestjs/common";
import { SocialMedia } from "../../../../generated/prisma";
import { SocialMediaCommandRepository } from "src/repositories/socialMedia/command.socialMedia";
import { AppLogger } from "../../../utils/logger";
import { CreateSocialMediaDto } from "../dto/create-socialMedia.dto";

@Injectable()
export class CreateSocialMediaService {
  private readonly logger: AppLogger;

  constructor(private readonly commandRepo: SocialMediaCommandRepository) {
    this.logger = new AppLogger('CreateSocialMediaService');
  }

  async execute(dto:CreateSocialMediaDto): Promise<SocialMedia> {
    try {
      this.logger.log('Service: Executing create social media', { dto });
      const newSocialMedia = await this.commandRepo.create(dto);
      this.logger.log('Service: Successfully created social media', { id: newSocialMedia.id });
      return newSocialMedia;
    } catch (error) {
      this.logger.error('Service: Error executing create social media', error);
      throw error;
    }
  }
}