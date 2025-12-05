import { Injectable } from "@nestjs/common";
import { AppLogger } from '../../utils/logger';
import { Admin } from "../../../generated/prisma";
import prisma from '../../configs/db.config';
import { IAdminCommandRepository } from "../interface/admin.repository.interface";
import { AdminResponse } from '../../types/admin.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminCommandRepository implements IAdminCommandRepository {
  private readonly logger: AppLogger;

  constructor() {
    this.logger = new AppLogger('AdminCommandRepository');
  }

  async create(data: any): Promise<AdminResponse> {
    try {
      this.logger.log('Creating new admin', { email: data.email });

      // Hash password before storing
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const admin = await prisma.prismaClient.admin.create({
        data: {
          ...data,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          status: true,
          created_at: true,
          updated_at: true,
        }
      });

      this.logger.log(`Successfully created admin with ID: ${admin.id}`);
      return admin;
    } catch (error) {
      this.logger.error('Error creating admin', { data, error });
      throw error;
    }
  }

  async update(id: string, data: any): Promise<AdminResponse> {
    try {
      this.logger.log(`Updating admin with ID: ${id}`);

      // If password is being updated, hash it
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }
      const admin = await prisma.prismaClient.admin.update({
        where: { id },
        data,
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          status: true,
          created_at: true,
          updated_at: true,
        }
      });

      this.logger.log(`Successfully updated admin with ID: ${admin.id}`);
      return admin;
    } catch (error) {
      this.logger.error(`Error updating admin with ID: ${id}`, { data, error });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.logger.log(`Deleting admin with ID: ${id}`);

      await prisma.prismaClient.admin.delete({
        where: { id },
      });

      this.logger.log(`Successfully deleted admin with ID: ${id}`);
    } catch (error) {
      this.logger.error(`Error deleting admin with ID: ${id}`, error);
      throw error;
    }
  }
}