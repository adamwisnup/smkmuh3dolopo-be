import { Injectable } from "@nestjs/common";
import { AppLogger } from "../../../utils/logger";
import { Career } from "../../../../generated/prisma";
import imagekit from '../../../configs/imagekit.config';
import { CreateCareerDto } from "../dto/create-career.dto";
import { CareerCommandRepository } from "src/repositories/careers/command.career";

@Injectable()
export class CreateCareerService {
  private readonly logger: AppLogger;

  constructor(private readonly commandRepo: CareerCommandRepository) {
    this.logger = new AppLogger('CreateCareerService');
  }

  async execute(dto: CreateCareerDto): Promise<Career> {
    try {
      this.logger.log('Service: Executing create career', { title: dto.title });

      let photoUrl: string | undefined;
      if (dto.photo && dto.photo.buffer) {
        const uploadResult = await imagekit.upload({
          file: dto.photo.buffer,
          fileName: `career-${Date.now()}`,
          folder: 'smkmuh3dlp/karir',
        });
        photoUrl = uploadResult.url;
        this.logger.log('Service: Photo uploaded to ImageKit', { url: photoUrl });
      }

      const newCareer = await this.commandRepo.create({
        title: dto.title,
        requirements: dto.requirements,
        job_description: dto.job_description,
        location: dto.location,
        benefits: dto.benefits,
        deadline: dto.deadline ? new Date(`${dto.deadline}T00:00:00.000Z`) : undefined,
        photo: photoUrl,
      });

      this.logger.log('Service: Successfully created career', { id: newCareer.id });
      return newCareer;
    } catch (error) {
      this.logger.error('Service: Error executing create career', error);
      throw error;
    }
  }
}