import { Injectable } from "@nestjs/common";
import { Teacher } from '../../../../generated/prisma';
import { AppLogger } from '../../../utils/logger';
import { TeacherQueryRepository } from "src/repositories/teachers/query.teacher";

@Injectable()
export class GetAllTeacherService {
  private readonly logger: AppLogger;

  constructor(private readonly queryRepo: TeacherQueryRepository) {
    this.logger = new AppLogger('GetAllTeacherService');
  }

  async execute(options: { page?: number; limit?: number } = {}): Promise<{ data: Teacher[]; pagination: any }> {
    try {
      this.logger.log('Service: Executing get all teachers', { options });
      const result = await this.queryRepo.findAll(options);
      this.logger.log('Service: Successfully retrieved teachers', { count: result.data.length });
      return result;
    } catch (error) {
      this.logger.error('Service: Error executing get all teachers', error);
      throw error;
    }
  }
}