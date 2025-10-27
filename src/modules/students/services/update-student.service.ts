import { Injectable } from "@nestjs/common";
import { StudentCommandRepository } from "src/repositories/students/command.student";
import { AppLogger } from "../../../utils/logger";
import { UpdateStudentDto } from "../dto/update-student.dto";
import { Student } from "../../../../generated/prisma";

@Injectable()
export class UpdateStudentService {
  private readonly logger: AppLogger;

  constructor(private readonly commandRepo: StudentCommandRepository) {
    this.logger = new AppLogger('UpdateStudentService');
  }

  async execute(id: string, dto: UpdateStudentDto): Promise<Student> {
    try {
      this.logger.log('Service: Executing update student', { id, dto });
      const updatedStudent = await this.commandRepo.update(id, dto);
      this.logger.log('Service: Successfully updated student', { id });
      return updatedStudent;
    } catch (error) {
      this.logger.error('Service: Error executing update student', { id, error });
      throw error;
    }
  }
}