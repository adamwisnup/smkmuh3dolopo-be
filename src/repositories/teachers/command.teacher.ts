import { Injectable } from "@nestjs/common";
import { ITeacherCommandRepository } from "../interface/teacher.repository.interface";
import { AppLogger } from '../../utils/logger';
import { Teacher, Prisma } from "../../../generated/prisma";
import prisma from '../../configs/db.config';

@Injectable()
export class TeacherCommandRepository implements ITeacherCommandRepository {
  private readonly logger: AppLogger;

  constructor() {
    this.logger = new AppLogger('TeacherCommandRepository');
  }

  async create(data: Prisma.TeacherCreateInput): Promise<Teacher> {
    try {
      this.logger.log('Creating new teacher', { name: (data as any).name });
      const newTeacher = await prisma.prismaClient.teacher.create({
        data,
      });
      this.logger.log('Teacher created successfully', { id: newTeacher.id });
      return newTeacher;
    } catch (error) {
      this.logger.error('Error creating teacher', error);
      throw error;
    }
  }

  async update(id: string, data: Prisma.TeacherUpdateInput): Promise<Teacher> {
    try {
      this.logger.log('Updating teacher', { id, dataKeys: Object.keys(data) });
      const updatedTeacher = await prisma.prismaClient.teacher.update({
        where: { id },
        data,
      });
      this.logger.log('Teacher updated successfully', { id });
      return updatedTeacher;
    } catch (error) {
      this.logger.error('Error updating teacher', { id, error });
      throw error;
    }
  }

  async delete(id: string): Promise<Teacher> {
    try {
      this.logger.log('Deleting teacher', { id });
      const deletedTeacher = await prisma.prismaClient.teacher.delete({
        where: { id },
      });
      this.logger.log('Teacher deleted successfully', { id });
      return deletedTeacher;
    } catch (error) {
      this.logger.error('Error deleting teacher', { id, error });
      throw error;
    }
  }
}