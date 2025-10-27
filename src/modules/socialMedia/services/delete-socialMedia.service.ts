import { Injectable } from "@nestjs/common";
import { SocialMediaCommandRepository } from "src/repositories/socialMedia/command.socialMedia";
import { AppLogger } from "../../../utils/logger";

@Injectable()
export class DeleteSocialMediaService {
  private readonly logger: AppLogger;

  constructor(
    private readonly commandRepo: SocialMediaCommandRepository
  ) {
    this.logger = new AppLogger('DeleteSocialMediaService');
  }

  async execute(id: string): Promise<void> {
    try {
      this.logger.log('Service: Executing delete social media', { id });
      await this.commandRepo.delete(id);
      this.logger.log('Service: Successfully deleted social media', { id });
    } catch (error) {
      this.logger.error('Service: Error executing delete social media', { id, error });
      throw error;
    }
  }
}