import { Injectable } from "@nestjs/common";
import { CareerCommandRepository } from "src/repositories/careers/command.career";
import { AppLogger } from "../../../utils/logger";

@Injectable()
export class DeleteCareerService {
  private readonly logger: AppLogger;

  constructor(
    private readonly commandRepo: CareerCommandRepository) {
    this.logger = new AppLogger('DeleteCareerService');
  }

  async execute(id: string): Promise<void> {
    try {
      this.logger.log('Service: Executing delete career', { id });
      await this.commandRepo.delete(id);
      this.logger.log('Service: Successfully deleted career', { id });
    }catch (error) {
      this.logger.error('Service: Error executing delete career', { id, error });
      throw error;
    }
  }
}