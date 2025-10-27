import { Injectable } from '@nestjs/common';
import { StudentQueryRepository } from '../../../repositories/students/query.student';
import { Student } from '../../../../generated/prisma';
import { AppLogger } from '../../../utils/logger';

@Injectable()
export class RegisterCountStudentService {
  private readonly logger: AppLogger;
  constructor(private readonly queryRepo: StudentQueryRepository) {
    this.logger = new AppLogger('RegisterCountStudentService');
  }

  async execute(): Promise<number> {
    try {
      this.logger.log('Service: Executing registered students count');
      const count = await this.queryRepo.totalStudentRegisterCount();
      this.logger.log(`Service: Registered students count retrieved: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Service: Error executing registered students count', error);
      throw error;
    }
  }
}