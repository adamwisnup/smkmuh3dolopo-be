import { Injectable } from "@nestjs/common";
import { TeacherCommandRepository } from "src/repositories/teachers/command.teacher";
import { AppLogger } from "../../../utils/logger";

@Injectable()
export class DeleteTeacherService {
  private readonly logger: AppLogger;

  constructor(
    private readonly commandRepo: TeacherCommandRepository
  ) {
    this.logger = new AppLogger('DeleteTeacherService');
  }

  async execute(id: string): Promise<void> {
    try {
      this.logger.log('Service: Executing delete teacher', { id });
      await this.commandRepo.delete(id);
      this.logger.log('Service: Successfully deleted teacher', { id });
    } catch (error) {
      this.logger.error('Service: Error executing delete teacher', { id, error });
      throw error;
    }
  }
}