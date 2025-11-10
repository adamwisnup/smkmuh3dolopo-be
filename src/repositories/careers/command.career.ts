import { Injectable } from '@nestjs/common';
import { Career, Prisma } from '../../../generated/prisma';
import prisma from '../../configs/db.config';
import { AppLogger } from '../../utils/logger';
import { ICareerCommandRepository } from '../interface/career.repository.interface';

@Injectable()
export class CareerCommandRepository implements ICareerCommandRepository {
  private readonly logger: AppLogger;
  constructor() {
    this.logger = new AppLogger('CareerCommandRepository');
  }

  async create(data: Prisma.CareerCreateInput): Promise<Career> {
    try {
      this.logger.log('Creating new career', { title: (data as any).title });

      const newCareer = await prisma.prismaClient.career.create({
        data,
      });
      this.logger.log('Career created successfully', { id: newCareer.id });
      return newCareer;
    } catch (error) {
      this.logger.error('Error creating career', error);
      throw error;
    }
  }

  async update(id: string, data: Prisma.CareerUpdateInput): Promise<Career> {
    try {
      this.logger.log('Updating career', { id, dataKeys: Object.keys(data) });
      const updatedCareer = await prisma.prismaClient.career.update({
        where: { id },
        data,
      });
      this.logger.log('Career updated successfully', { id });
      return updatedCareer;
    } catch (error) {
      this.logger.error('Error updating career', { id, error });
      throw error;
    }
  }

  async delete(id: string): Promise<Career> {
    try {
      this.logger.log('Deleting career', { id });

      const deletedCareer = await prisma.prismaClient.career.delete({
        where: { id },
      });
      this.logger.log('Career deleted successfully', { id });
      return deletedCareer;
    } catch (error) {
      this.logger.error('Error deleting career', { id, error });
      throw error;
    }
  }
}
  