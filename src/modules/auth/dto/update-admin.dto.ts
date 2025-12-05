import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsString, IsEnum, IsOptional } from 'class-validator';
import { CreateAdminDto } from './create-admin.dto';
import { AdminRole } from '../../../../generated/prisma';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiProperty({ example: 'John Doe Updated', description: 'Updated admin full name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'john.updated@example.com', description: 'Updated admin email address', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    enum: AdminRole,
    example: 'SUPER_ADMIN',
    description: 'Updated admin role',
    required: false
  })
  @IsEnum(AdminRole)
  @IsOptional()
  role?: AdminRole;

  @ApiProperty({
    enum: ['ACTIVE', 'INACTIVE'],
    example: 'INACTIVE',
    required: false,
    description: 'Updated admin status'
  })
  @IsOptional()
  @IsEnum(['ACTIVE', 'INACTIVE'])
  status?: string;
}