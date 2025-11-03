import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../../utils/logger';
import { TeacherCommandRepository } from 'src/repositories/teachers/command.teacher';
import { Teacher } from '../../../../generated/prisma';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import imagekit from '../../../configs/imagekit.config';

@Injectable()
export class UpdateTeacherService {
  private readonly logger: AppLogger;

  constructor(private readonly commandRepo: TeacherCommandRepository) {
    this.logger = new AppLogger('UpdateTeacherService');
  }

  async execute(id: string, dto: UpdateTeacherDto): Promise<Teacher> {
    try {
      this.logger.log('Service: Executing update teacher', { id });

      let photoUrl: string | undefined;

      if (dto.photo && dto.photo.buffer) {
        const uploadResult = await imagekit.upload({
          file: dto.photo.buffer,
          fileName: `teacher-${id}-${Date.now()}`,
          folder: 'smkmuh3dlp/guru',
        });
        photoUrl = uploadResult.url;
        this.logger.log('Service: Photo uploaded to ImageKit', { url: photoUrl });
      }

      const { photo: _filePhoto, ...restDto } = dto as any;
      const updatePayload: any = { ...restDto };
      if (photoUrl) {
        updatePayload.photo = photoUrl;
      }

      const updatedTeacher = await this.commandRepo.update(id, updatePayload);

      this.logger.log('Service: Successfully updated teacher', { id });
      return updatedTeacher;
    } catch (error) {
      this.logger.error('Service: Error executing update teacher', { id, error });
      throw error;
    }
  }
}