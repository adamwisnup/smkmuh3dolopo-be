import { Injectable } from "@nestjs/common";
import { Teacher } from '../../../../generated/prisma';
import { AppLogger } from '../../../utils/logger';
import { TeacherQueryRepository } from "src/repositories/teachers/query.teacher";

@Injectable()
export class GetByIdTeacherService {
  private readonly logger: AppLogger;

  constructor(private readonly queryRepo: TeacherQueryRepository) {
    this.logger = new AppLogger('GetByIdTeacherService');
  }

  async execute(id: string): Promise<Teacher | null> {
    try {
      this.logger.log(`Service: Executing get teacher by ID: ${id}`);
      const teacher = await this.queryRepo.findById(id);
      if (!teacher) {
        this.logger.warn(`Service: Teacher not found (id: ${id})`);
        return null;
      }
      this.logger.log(`Service: Successfully retrieved teacher (id: ${id})`);
      return teacher;
    }catch (error) {
      this.logger.error(`Service: Error executing get teacher by ID (id: ${id})`, error);
      throw error;
    }
  }
}