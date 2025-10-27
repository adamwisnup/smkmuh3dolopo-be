import { Module } from '@nestjs/common';
import { StudentController } from './controllers/student.controller';
import { RepositoryModule } from '../../repositories/repository.module';
import { GetAllStudentService } from './services/getAll-student.service';
import { GetByIdStudentService } from './services/getById-student.service';
import { CreateStudentService } from './services/create-student.service';
import { UpdateStudentService } from './services/update-student.service';
import { DeleteStudentService } from './services/delete-student.service';
import { RegisterCountStudentService } from './services/registerCount-student.service';
import { LastWeekRegisterCountStudentService } from './services/LastWeekRegisterCount-student.service';

@Module({
  imports: [RepositoryModule],
  controllers: [StudentController],
  providers: [
    GetAllStudentService,
    GetByIdStudentService,
    CreateStudentService,
    UpdateStudentService,
    DeleteStudentService,
    RegisterCountStudentService,
    LastWeekRegisterCountStudentService,
  ],
})
export class StudentModule {}
