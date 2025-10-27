import { Injectable } from "@nestjs/common";
import { StudentCommandRepository } from "src/repositories/students/command.student";
import { AppLogger } from "../../../utils/logger";

@Injectable()
export class DeleteStudentService {
  private readonly logger: AppLogger;

  constructor(
    private readonly commandRepo: StudentCommandRepository

  ) {
    this.logger = new AppLogger('DeleteStudentService');
  }

  async execute(id: string): Promise<void> {
    try {
      this.logger.log('Service: Executing delete student', { id });
      await this.commandRepo.delete(id);
      this.logger.log('Service: Successfully deleted student', { id });
    } catch (error) {
      this.logger.error('Service: Error executing delete student', { id, error });
      throw error;
    }
  }
}