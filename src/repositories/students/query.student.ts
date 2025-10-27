import { Injectable } from '@nestjs/common';
import { Student } from '../../../generated/prisma';
import prisma from '../../configs/db.config';
import { IStudentQueryRepository } from '../interface/student.repository.interface';
import { AppLogger } from '../../utils/logger';
import { defaultPaginator, generatePaginator } from '../../utils/paginator';

@Injectable()
export class StudentQueryRepository implements IStudentQueryRepository {
  private readonly logger: AppLogger;

  constructor() {
    this.logger = new AppLogger('StudentQueryRepository');
  }

  async findAll(options: { page?: number; limit?: number } = {}): Promise<{ data: Student[]; pagination: any }> {
    try {
      this.logger.log('Fetching all students with pagination', { options });

      const { page, limit, offset } = defaultPaginator(options);
      const [students, totalCount] = await Promise.all([
        prisma.prismaClient.student.findMany({
          skip: offset,
          take: limit,
          orderBy: { created_at: 'desc' },
        }),
        prisma.prismaClient.student.count(),
      ]);

      const pagination = generatePaginator(page, limit, totalCount);

      this.logger.log('Successfully fetched students', { totalCount, pagination });
      return { data: students, pagination };
    } catch (error) {
      this.logger.error('Error fetching students', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Student | null> {
    try {
      this.logger.debug(`Finding student by ID: ${id}`);
      const student = await prisma.prismaClient.student.findUnique({
        where: { id },
      });
      if (!student) {
        this.logger.warn(`Student not found (id: ${id})`);
      }
      return student;
    } catch (error) {
      this.logger.error('Error finding student by ID', { id, error });
      throw error;
    }
  }

  async totalStudentRegisterCount(): Promise<number> {
    try {
      this.logger.debug('Counting total student registrations');
      const count = await prisma.prismaClient.student.count();
      this.logger.log(`Total student registration count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error counting total student registrations', error);
      throw error;
    }
  }

  async studentRegisterLastWeekCount(): Promise<number> {
    try {
      this.logger.debug('Counting student registrations in the last week');
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const count = await prisma.prismaClient.student.count({
        where: {
          created_at: {
            gte: oneWeekAgo,
          },
        },
      });
      this.logger.log(`Student registrations in the last week: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error counting student registrations in the last week', error);
      throw error;
    }
  }
}