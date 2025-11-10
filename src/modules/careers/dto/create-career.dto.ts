import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateCareerDto {
  @ApiProperty({ description: 'Judul lowongan pekerjaan', example: 'Software Engineer' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Persyaratan pekerjaan', example: 'Pengalaman minimal 2 tahun dalam pengembangan web.' })
  @IsString()
  @IsOptional()
  requirements?: string;

  @ApiProperty({ description: 'Deskripsi pekerjaan', example: 'Bertanggung jawab untuk mengembangkan aplikasi web.' })
  @IsString()
  @IsOptional()
  job_description?: string;

  @ApiProperty({ description: 'Lokasi pekerjaan', example: 'Jakarta, Indonesia' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ description: 'Benefit pekerjaan', example: 'Gaji kompetitif, asuransi kesehatan, dan cuti tahunan.' })
  @IsString()
  @IsOptional()
  benefits?: string;

  @ApiProperty({ description: 'Tanggal penutupan lowongan pekerjaan', example: '2024-12-31' })
  @IsDateString()
  @IsOptional()
  deadline?: string;

  @ApiProperty({ description: 'Poster career (opsional)', type: 'string', format: 'binary', required: false })
  @IsOptional()
  photo?: Express.Multer.File;
}