import { Module } from '@nestjs/common';
import { RepositoryModule } from '../../repositories/repository.module';
import { CareerController } from './controllers/career.controller';
import { CreateCareerService } from './services/create-career.service';
import { GetByIdCareerService } from './services/getById-carrer.service';
import { UpdateCareerService } from './services/update-career.service';
import { DeleteCareerService } from './services/delete-career.service';
import { GetAllCareerService } from './services/getAll-career.service';

@Module({
  imports: [RepositoryModule],
  controllers: [CareerController],
  providers: [
    CreateCareerService,
    GetByIdCareerService,
    UpdateCareerService,
    DeleteCareerService,
    GetAllCareerService,
  ],
})

export class CareerModule {}