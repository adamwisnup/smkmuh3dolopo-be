import { Injectable } from "@nestjs/common";
import { AppLogger } from '../../utils/logger';
import { Admin } from "../../../generated/prisma";
import prisma from '../../configs/db.config';
import { IAdminQueryRepository } from "../interface/admin.repository.interface";

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
}