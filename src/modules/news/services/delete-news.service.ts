import { Injectable } from "@nestjs/common";
import { NewsCommandRepository } from "src/repositories/news/command.news";
import { AppLogger } from "../../../utils/logger";

@Injectable()
export class DeleteNewsService {
  private readonly logger: AppLogger;

  constructor(
    private readonly commandRepo: NewsCommandRepository
  ) {
    this.logger = new AppLogger('DeleteNewsService');
  }

  async execute(id: string): Promise<void> {
    try {
      this.logger.log('Service: Executing delete news', { id });
      await this.commandRepo.delete(id);
      this.logger.log('Service: Successfully deleted news', { id });
    } catch (error) {
      this.logger.error('Service: Error executing delete news', { id, error });
      throw error;
    }
  }
}