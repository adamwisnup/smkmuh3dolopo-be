import { Module } from '@nestjs/common';
import { RepositoryModule } from '../../repositories/repository.module';
import { NewsController } from './controllers/news.controller';
import { GetAllNewsService } from './services/getAll-news.service';
import { GetByIdNewsService } from './services/getById-news.service';
import { CreateNewsService } from './services/create-news.service';
import { UpdateNewsService } from './services/update-news.service';
import { DeleteNewsService } from './services/delete-news.service';
import { PublishCountNewsService } from './services/publishCount-news.service';
import { TotalCountNewsService } from './services/totalCount-news.service';

@Module({
  imports: [RepositoryModule],
  controllers: [NewsController],
  providers: [
    GetAllNewsService,
    GetByIdNewsService,
    CreateNewsService,
    UpdateNewsService,
    DeleteNewsService,
    PublishCountNewsService,
    TotalCountNewsService,
  ],
})

export class NewsModule {}