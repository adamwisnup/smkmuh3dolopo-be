import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, IsOptional, IsStrongPassword } from 'class-validator';
import { AdminRole } from '../../../../generated/prisma';

export class CreateAdminDto {
  @ApiProperty({ example: 'John Doe', description: 'Admin full name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Admin email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongP@ssw0rd123!', description: 'Strong password' })
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    enum: AdminRole,
    example: 'ADMIN',
    description: 'Admin role (ADMIN or SUPER_ADMIN)'
  })
  @IsEnum(AdminRole)
  role: AdminRole;

  @ApiProperty({
    enum: ['ACTIVE', 'INACTIVE'],
    example: 'ACTIVE',
    required: false,
    description: 'Admin status (default: ACTIVE)'
  })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE'])
  status?: string = 'ACTIVE';
}