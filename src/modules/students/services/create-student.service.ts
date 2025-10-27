import { Injectable } from "@nestjs/common";
import { Student } from "../../../../generated/prisma";
import { StudentCommandRepository } from "src/repositories/students/command.student";
import { AppLogger } from "../../../utils/logger";
import { CreateStudentDto } from "../dto/create-student.dto";

@Injectable()
export class CreateStudentService {
  private readonly logger: AppLogger;

  constructor(private readonly commandRepo: StudentCommandRepository) {
    this.logger = new AppLogger('CreateStudentService');
  }

  async execute(dto:CreateStudentDto): Promise<Student> {
    try {
      this.logger.log('Service: Executing create student', { dto });
      const newStudent = await this.commandRepo.create(dto);
      this.logger.log('Service: Successfully created student', { id: newStudent.id });
      return newStudent;
    } catch (error) {
      this.logger.error('Service: Error executing create student', error);
      throw error;
    }
  }
}