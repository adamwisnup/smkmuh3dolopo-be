import { Injectable } from "@nestjs/common";
import { AppLogger } from '../../utils/logger';
import { Career } from '../../../generated/prisma';
import { defaultPaginator, generatePaginator } from '../../utils/paginator';
import prisma from '../../configs/db.config';
import { ICareerQueryRepository } from "../interface/career.repository.interface";

@Injectable()
export class CareerQueryRepository implements ICareerQueryRepository {
  private readonly logger: AppLogger;
  constructor() {
    this.logger = new AppLogger('CareerQueryRepository');
  }

  async findAll(options?: { page?: number; limit?: number }): Promise<{ data: Career[]; pagination: any }> {
    try {
      this.logger.log('Fetching all careers with pagination', { options });

      const { page, limit, offset } = defaultPaginator(options);

      const [careers, totalCount] = await Promise.all([
        prisma.prismaClient.career.findMany({
          skip: offset,
          take: limit,
          orderBy: { created_at: 'desc' },
        }),
        prisma.prismaClient.career.count(),
      ]);
      const pagination = generatePaginator(page, limit, totalCount);

      this.logger.log('Successfully fetched careers', { totalCount, pagination });
      return { data: careers, pagination };
    } catch (error) {
      this.logger.error('Error fetching careers', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Career | null> {
    try {
      this.logger.debug(`Finding career by ID: ${id}`);
      const career = await prisma.prismaClient.career.findUnique({
        where: { id },
      });
      if (!career) {
        this.logger.warn(`Career not found (id: ${id})`);
      }
      
      return career;
    } catch (error) {
      this.logger.error('Error finding career by ID', { id, error });
      throw error;
    }
  }
}