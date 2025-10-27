import { Injectable } from '@nestjs/common';
import { StudentQueryRepository } from '../../../repositories/students/query.student';
import { Student } from '../../../../generated/prisma';
import { AppLogger } from '../../../utils/logger';

@Injectable()
export class GetAllStudentService {
  private readonly logger: AppLogger;

  constructor(private readonly queryRepo: StudentQueryRepository) {
    this.logger = new AppLogger('GetAllStudentService');
  }

  async execute(options: { page?: number; limit?: number } = {}): Promise<{ data: Student[]; pagination: any }> {
    try {
      this.logger.log('Service: Executing get all students', { options });
      const result = await this.queryRepo.findAll(options);
      this.logger.log('Service: Successfully retrieved students', { count: result.data.length });
      return result;
    } catch (error) {
      this.logger.error('Service: Error executing get all students', error);
      throw error;
    }
  }
}