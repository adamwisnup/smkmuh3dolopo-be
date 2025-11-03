import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../../utils/logger';
import { TeacherCommandRepository } from 'src/repositories/teachers/command.teacher';
import { CreateTeacherDto } from '../dto/create-student.dto';
import { Teacher } from '../../../../generated/prisma';
import imagekit from '../../../configs/imagekit.config';

@Injectable()
export class CreateTeacherService {
  private readonly logger: AppLogger;

  constructor(private readonly commandRepo: TeacherCommandRepository) {
    this.logger = new AppLogger('CreateTeacherService');
  }

  async execute(dto: CreateTeacherDto): Promise<Teacher> {
    try {
      this.logger.log('Service: Executing create teacher', { name: dto.name });

      let photoUrl: string | undefined;

      if (dto.photo && dto.photo.buffer) {
        const uploadResult = await imagekit.upload({
          file: dto.photo.buffer,
          fileName: `teacher-${Date.now()}`,
          folder: 'smkmuh3dlp/guru',
        });
        photoUrl = uploadResult.url;
        this.logger.log('Service: Photo uploaded to ImageKit', { url: photoUrl });
      }

      const newTeacher = await this.commandRepo.create({
        name: dto.name,
        place_date_of_birth: dto.place_date_of_birth,
        status: dto.status,
        start_working_date: dto.start_working_date,
        position: dto.position,
        role: dto.role,
        nuptk_nbm: dto.nuptk_nbm,
        education: dto.education,
        photo: photoUrl,
      });

      this.logger.log('Service: Successfully created teacher', { id: newTeacher.id });
      return newTeacher;
    } catch (error) {
      this.logger.error('Service: Error executing create teacher', error);
      throw error;
    }
  }
}