import { Injectable } from "@nestjs/common";
import { AppLogger } from "../../../utils/logger";
import { TeacherCommandRepository } from "src/repositories/teachers/command.teacher";
import { CreateTeacherDto } from "../dto/create-student.dto";
import { Teacher } from "../../../../generated/prisma";

@Injectable()
export class CreateTeacherService {
  private readonly logger: AppLogger;

  constructor(private readonly commandRepo: TeacherCommandRepository) {
    this.logger = new AppLogger('CreateTeacherService');
  }

  async execute(dto:CreateTeacherDto): Promise<Teacher> {
    try {
      this.logger.log('Service: Executing create teacher', { dto });
      const newTeacher = await this.commandRepo.create(dto);
      this.logger.log('Service: Successfully created teacher', { id: newTeacher.id });
      return newTeacher;
    } catch (error) {
      this.logger.error('Service: Error executing create teacher', error);
      throw error;
    }
  }
}