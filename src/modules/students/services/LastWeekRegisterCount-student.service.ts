import { Injectable } from '@nestjs/common';
import { StudentQueryRepository } from '../../../repositories/students/query.student';
import { Student } from '../../../../generated/prisma';
import { AppLogger } from '../../../utils/logger';

@Injectable()
export class LastWeekRegisterCountStudentService {
  private readonly logger: AppLogger;
  constructor(private readonly queryRepo: StudentQueryRepository) {
    this.logger = new AppLogger('LastWeekRegisterCountStudentService');
  }

  async execute(): Promise<number> {
    try {
      this.logger.log('Service: Executing last week registered students count');
      const count = await this.queryRepo.studentRegisterLastWeekCount();
      this.logger.log(`Service: Last week registered students count retrieved: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Service: Error executing last week registered students count', error);
      throw error;
    }
  }
}