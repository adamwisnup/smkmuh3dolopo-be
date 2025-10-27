import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateSocialMediaDto {
  @ApiProperty({ description: 'Nama media sosial', example: 'Instagram' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'URL media sosial', example: 'https://instagram.com/username' })
  @IsString()
  link: string;
}