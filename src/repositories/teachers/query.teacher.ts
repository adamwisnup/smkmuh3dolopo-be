import { Injectable } from "@nestjs/common";
import { ITeacherQueryRepository } from "../interface/teacher.repository.interface";
import { AppLogger } from '../../utils/logger';
import { Teacher } from "../../../generated/prisma";
import prisma from '../../configs/db.config';
import { defaultPaginator, generatePaginator } from '../../utils/paginator';

@Injectable()
export class TeacherQueryRepository implements ITeacherQueryRepository {
  private readonly logger: AppLogger;

  constructor() {
    this.logger = new AppLogger('TeacherQueryRepository');
  }

  async findAll(options?: { page?: number; limit?: number }): Promise<{ data: Teacher[]; pagination: any }> {
    try {
      this.logger.log('Fetching all teachers with pagination', { options });
      
      const { page, limit, offset } = defaultPaginator(options);
      const [students, totalCount] = await Promise.all([
        prisma.prismaClient.teacher.findMany({
          skip: offset,
          take: limit,
          orderBy: { created_at: 'desc' },
        }),
        prisma.prismaClient.teacher.count(),
      ]);

      const pagination = generatePaginator(page, limit, totalCount);
      this.logger.log('Successfully fetched teachers', { totalCount, pagination });
      return { data: students, pagination };
    } catch (error) {
      this.logger.error('Error fetching teachers', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Teacher | null> {
    try {
      this.logger.debug(`Finding teacher by ID: ${id}`);
      const teacher = await prisma.prismaClient.teacher.findUnique({
        where: { id },
      });
      if (!teacher) {
        this.logger.warn(`Teacher not found (id: ${id})`);
      }
      return teacher;
    } catch (error) {
      this.logger.error('Error finding teacher by ID', { id, error });
      throw error;
    }
  }
}