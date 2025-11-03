import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { StatusNews } from '../../../../generated/prisma';

export class CreateNewsDto {
  @ApiProperty({ description: 'Judul berita', example: 'Berita Sekolah Hari Ini' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Konten berita', example: 'Ini adalah isi dari berita sekolah hari ini...' })
  @IsString()
  content: string;
  
  @ApiProperty({ description: 'Foto berita (opsional)', type: 'string', format: 'binary', required: false})
  @IsOptional()
  photo?: Express.Multer.File;

  @ApiProperty({ description: 'Status berita', enum: StatusNews, example: StatusNews.DRAFT })
  @IsEnum(StatusNews)
  status: StatusNews;
}