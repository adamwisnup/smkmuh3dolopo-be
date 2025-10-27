import { Injectable } from "@nestjs/common";
import { AppLogger } from "../../../utils/logger";
import { TeacherCommandRepository } from "src/repositories/teachers/command.teacher";
import { Teacher } from "../../../../generated/prisma";
import { UpdateTeacherDto } from "../dto/update-teacher.dto";

@Injectable()
export class UpdateTeacherService {
  private readonly logger: AppLogger;

  constructor(private readonly commandRepo: TeacherCommandRepository) {
    this.logger = new AppLogger('UpdateTeacherService');
  }

  async execute(id: string, dto: UpdateTeacherDto): Promise<Teacher> {
    try {
      this.logger.log('Service: Executing update teacher', { id, dto });
      const updatedTeacher = await this.commandRepo.update(id, dto);
      this.logger.log('Service: Successfully updated teacher', { id });
      return updatedTeacher;
    } catch (error) {
      this.logger.error('Service: Error executing update teacher', { id, error });
      throw error;
    }
  }
}