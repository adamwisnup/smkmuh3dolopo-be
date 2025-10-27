import { Module, Get } from '@nestjs/common';
import { RepositoryModule } from '../../repositories/repository.module';
import { SocialMediaController } from './controllers/socialMedia.controller';
import { GetAllSocialMediaService } from './services/getAll-socialMedia.service';
import { CreateSocialMediaService } from './services/create-socialMedia.service';
import { UpdateSocialMediaService } from './services/update-socialMedia.service';
import { DeleteSocialMediaService } from './services/delete-socialMedia.service';
import { GetByIdSocialMediaService } from './services/getById-socialMedia.service';

@Module({
  imports: [RepositoryModule],
  controllers: [SocialMediaController],
  providers: [
    GetAllSocialMediaService,
    GetByIdSocialMediaService,
    CreateSocialMediaService,
    UpdateSocialMediaService,
    DeleteSocialMediaService,
  ],
})

export class SocialMediaModule {}
