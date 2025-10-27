import { Module } from '@nestjs/common';
import { RepositoryModule } from '../../repositories/repository.module';
import { TeacherController } from './controllers/teacher.controller';
import { GetAllTeacherService } from './services/getAll-teacher.service';
import { GetByIdTeacherService } from './services/getById-teacher.service';
import { CreateTeacherService } from './services/create-teacher.service';
import { UpdateTeacherService } from './services/update-teacher.service';
import { DeleteTeacherService } from './services/delete-teacher.service';

@Module({
  imports: [RepositoryModule],
  controllers: [TeacherController],
  providers: [
    GetAllTeacherService,
    GetByIdTeacherService,
    CreateTeacherService,
    UpdateTeacherService,
    DeleteTeacherService,
  ],
})

export class TeacherModule {}