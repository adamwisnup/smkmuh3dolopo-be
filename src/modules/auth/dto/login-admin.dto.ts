import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({ description: 'Email admin', example: 'admin@example.com' })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password admin', example: 'securePassword123' })
  @IsString()
  password: string;
}