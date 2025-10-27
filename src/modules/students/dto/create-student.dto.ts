import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ description: 'Nama siswa', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Jenis kelamin', example: 'Laki-laki' })
  @IsString()
  gender: string;

  @ApiProperty({ description: 'Tempat lahir', example: 'Jakarta' })
  @IsString()
  place_of_birth: string;

  @ApiProperty({ description: 'Tanggal lahir', example: '2000-01-01T00:00:00.000Z' })
  @IsDateString()
  date_of_birth: Date;

  @ApiProperty({ description: 'Alamat', example: 'Jl. Sudirman No. 1' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Nomor telepon', example: '08123456789' })
  @IsString()
  phone_number: string;

  @ApiProperty({ description: 'Asal sekolah', example: 'SMA Negeri 1' })
  @IsString()
  from_school: string;

  @ApiProperty({ description: 'Tahun kelulusan', example: 2020 })
  @IsNumber()
  graduation_year: number;

  @ApiProperty({ description: 'Nama ayah biologis', example: 'Budi Santoso' })
  @IsString()
  biological_father: string;

  @ApiProperty({ description: 'Nama ibu biologis', example: 'Siti Aminah' })
  @IsString()
  biological_mother: string;

  @ApiProperty({ description: 'Kondisi ayah', example: 'Hidup' })
  @IsString()
  father_condition: string;

  @ApiProperty({ description: 'Kondisi ibu', example: 'Hidup' })
  @IsString()
  mother_condition: string;

  @ApiProperty({ description: 'Pekerjaan ayah', example: 'Pegawai Negeri' })
  @IsString()
  father_job: string;

  @ApiProperty({ description: 'Pekerjaan ibu', example: 'Ibu Rumah Tangga' })
  @IsString()
  mother_job: string;

  @ApiProperty({ description: 'Nomor telepon wali/orang tua', example: '08123456789' })
  @IsString()
  parent_guardian_phone_number: string;

  @ApiProperty({ description: 'Jurusan', example: 'Teknik Informatika' })
  @IsString()
  major: string;

  @ApiProperty({ description: 'Rekomendasi dari', example: 'Sekolah' })
  @IsString()
  recommendation_from: string;
}