import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';
import { StatusUser } from '../../../../generated/prisma';

export class CreateTeacherDto {
  @ApiProperty({ description: 'Nama guru', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Tempat dan tanggal lahir', example: 'Jakarta, 1990-01-01' })
  @IsString()
  place_date_of_birth: string;

  @ApiProperty({ description: 'Status guru', enum: StatusUser, example: StatusUser.ACTIVE })
  @IsEnum(StatusUser)
  status: StatusUser;

  @ApiProperty({ description: 'Tanggal mulai bekerja', example: '2020-01-01T00:00:00.000Z' })
  @IsDateString()
  start_working_date: Date;

  @ApiProperty({ description: 'Posisi jabatan', example: 'Guru Matematika' })
  @IsString()
  position: string;

  @ApiProperty({ description: 'Role guru', example: 'Pengajar' })
  @IsString()
  role: string;

  @ApiProperty({ description: 'Nomor NUPTK/NBM (opsional)', example: '123456789', required: false })
  @IsOptional()
  @IsString()
  nuptk_nbm?: string;

  @ApiProperty({ description: 'Pendidikan terakhir', example: 'S1 Matematika' })
  @IsString()
  education: string;

  @ApiProperty({ description: 'Foto guru (opsional)', example: 'https://example.com/photo.jpg', required: false })
  @IsOptional()
  @IsString()
  photo?: string;
}