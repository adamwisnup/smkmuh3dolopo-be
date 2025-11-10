import { UpdateCareerDto } from './../dto/update-career.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AppLogger } from '../../../utils/logger';
import { CareerCommandRepository } from 'src/repositories/careers/command.career';
import { CareerQueryRepository } from 'src/repositories/careers/query.career';
import { Career } from '../../../../generated/prisma';
import imagekit from '../../../configs/imagekit.config';

@Injectable()
export class UpdateCareerService {
  private readonly logger: AppLogger;

  constructor(
    private readonly commandRepo: CareerCommandRepository,
    private readonly queryRepo: CareerQueryRepository,

  ) {
    this.logger = new AppLogger('UpdateCareerService');
  }

  async execute(id: string, dto: UpdateCareerDto): Promise<Career> {
  try {
    this.logger.log('Service: Executing update career', { id });
    
    const existingCareer = await this.queryRepo.findById(id);
    if (!existingCareer) {
      throw new NotFoundException(`Career with ID ${id} not found`);
    }

    let photoUrl: string | undefined;
    if (dto.photo?.buffer) {
      const uploadResult = await imagekit.upload({
        file: dto.photo.buffer,
        fileName: `career-${id}-${Date.now()}`,
        folder: 'smkmuh3dlp/karir',
      });
      photoUrl = uploadResult.url;
    }

    const updatePayload: Partial<Career> = {
      title: dto.title ?? existingCareer.title,
      requirements: dto.requirements ?? existingCareer.requirements,
      job_description: dto.job_description ?? existingCareer.job_description,
      location: dto.location ?? existingCareer.location,
      benefits: dto.benefits ?? existingCareer.benefits,
      deadline: dto.deadline
        ? new Date(`${dto.deadline}T00:00:00.000Z`)
        : existingCareer.deadline,
      photo: photoUrl ?? existingCareer.photo,
    };

    const updatedCareer = await this.commandRepo.update(id, updatePayload);

    this.logger.log('Service: Successfully updated career', { id });
    return updatedCareer;
  } catch (error) {
    this.logger.error('Service: Error executing update career', { id, error });
    throw error;
  }
}
}