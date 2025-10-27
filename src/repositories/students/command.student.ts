import { Injectable } from '@nestjs/common';
import { Student, Prisma } from '../../../generated/prisma';
import prisma from '../../configs/db.config';
import { IStudentCommandRepository } from '../interface/student.repository.interface';
import { AppLogger } from '../../utils/logger';

@Injectable()
export class StudentCommandRepository implements IStudentCommandRepository {
  private readonly logger: AppLogger;

  constructor() {
    this.logger = new AppLogger('StudentCommandRepository');
  }

  async create(data: Prisma.StudentCreateInput): Promise<Student> {
    try {
      this.logger.log('Creating new student', { name: (data as any).name });
      const newStudent = await prisma.prismaClient.student.create({
        data,
      });
      this.logger.log('Student created successfully', { id: newStudent.id });
      return newStudent;
    } catch (error) {
      this.logger.error('Error creating student', error);
      throw error;
    }
  }

  async update(id: string, data: Prisma.StudentUpdateInput): Promise<Student> {
    try {
      this.logger.log('Updating student', { id, dataKeys: Object.keys(data) });
      const updatedStudent = await prisma.prismaClient.student.update({
        where: { id },
        data,
      });
      this.logger.log('Student updated successfully', { id });
      return updatedStudent;
    } catch (error) {
      this.logger.error('Error updating student', { id, error });
      throw error;
    }
  }

  async delete(id: string): Promise<Student> {
    try {
      this.logger.log('Deleting student', { id });
      const deletedStudent = await prisma.prismaClient.student.delete({
        where: { id },
      });
      this.logger.log('Student deleted successfully', { id });
      return deletedStudent;
    } catch (error) {
      this.logger.error('Error deleting student', { id, error });
      throw error;
    }
  }
}