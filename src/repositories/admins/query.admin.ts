import { Injectable } from "@nestjs/common";
import { AppLogger } from '../../utils/logger';
import { Admin } from "../../../generated/prisma";
import prisma from '../../configs/db.config';
import { IAdminQueryRepository } from "../interface/admin.repository.interface";
import { defaultPaginator, generatePaginator } from '../../utils/paginator';

@Injectable()
export class AdminQueryRepository implements IAdminQueryRepository {
  private readonly logger: AppLogger;

  constructor() {
    this.logger = new AppLogger('AdminQueryRepository');
  }

  async findByEmail(email: string): Promise<Admin | null> {
    try {
      this.logger.debug(`Finding admin by email: ${email}`);
      const admin = await prisma.prismaClient.admin.findUnique({
        where: { email },
      });
      if (!admin) {
        this.logger.warn(`Admin not found (email: ${email})`);
      }
      return admin;
    } catch (error) {
      this.logger.error('Error finding admin by email', { email, error });
      throw error;
    }
  }

  async findById(id: string): Promise<Admin | null> {
    try {
      this.logger.debug(`Finding admin by ID: ${id}`);
      const admin = await prisma.prismaClient.admin.findUnique({
        where: { id },
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
      if (!admin) {
        this.logger.warn(`Admin not found (id: ${id})`);
      }
      return admin;
    } catch (error) {
      this.logger.error('Error finding admin by ID', { id, error });
      throw error;
    }
  }

  async findAll(options: { page?: number; limit?: number } = {}): Promise<{ data: Admin[]; pagination: any }> {
    try {
      this.logger.log('Fetching all admins with pagination', { options });

      const { page, limit, offset } = defaultPaginator(options);
      const [admins, totalCount] = await Promise.all([
        prisma.prismaClient.admin.findMany({
          skip: offset,
          take: limit,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
            status: true,
            created_at: true,
            updated_at: true,
          },
        }),
        prisma.prismaClient.admin.count(),
      ]);

      const pagination = generatePaginator(page, limit, totalCount);

      this.logger.log('Successfully fetched admins', { totalCount, pagination });
      return { data: admins, pagination };
    } catch (error) {
      this.logger.error('Error fetching admins', error);
      throw error;
    }
  }
}