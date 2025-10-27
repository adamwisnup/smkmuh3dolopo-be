import { Injectable } from '@nestjs/common';
import { StudentQueryRepository } from '../../../repositories/students/query.student';
import { Student } from '../../../../generated/prisma';
import { AppLogger } from '../../../utils/logger';

@Injectable()
export class GetByIdStudentService {
  private readonly logger: AppLogger;

  constructor(private readonly queryRepo: StudentQueryRepository) {
    this.logger = new AppLogger('GetByIdStudentService');
  }

  async execute(id: string): Promise<Student | null> {
    try {
      this.logger.log(`Service: Executing get student by ID: ${id}`);
      const student = await this.queryRepo.findById(id);
      if (!student) {
        this.logger.warn(`Service: Student not found (id: ${id})`);
        return null;
      }
      this.logger.log(`Service: Successfully retrieved student (id: ${id})`);
      return student;
    }catch (error) {
      this.logger.error(`Service: Error executing get student by ID (id: ${id})`, error);
      throw error;
    }
  }
}