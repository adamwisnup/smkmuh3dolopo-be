import { Injectable } from "@nestjs/common";
import { Career } from '../../../../generated/prisma';
import { AppLogger } from '../../../utils/logger';
import { CareerQueryRepository } from "src/repositories/careers/query.career";

@Injectable()
export class GetByIdCareerService {
  private readonly logger: AppLogger;

  constructor(private readonly queryRepo: CareerQueryRepository) {
    this.logger = new AppLogger('GetByIdCareerService');
  }

  async execute(id: string): Promise<Career | null> {
    try {
      this.logger.log(`Service: Executing get career by ID: ${id}`);
      const career = await this.queryRepo.findById(id);
      if (!career) {
        this.logger.warn(`Service: Career not found (id: ${id})`);
        return null;
      }
      this.logger.log(`Service: Successfully retrieved career (id: ${id})`);
      return career;
    }catch (error) {
      this.logger.error(`Service: Error executing get career by ID (id: ${id})`, error);
      throw error;
    }
  }
} 