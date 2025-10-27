import { PartialType } from '@nestjs/swagger';
import { CreateSocialMediaDto } from './create-socialMedia.dto';

export class UpdateSocialMediaDto extends PartialType(CreateSocialMediaDto) {}