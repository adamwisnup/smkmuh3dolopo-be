import { PartialType } from '@nestjs/swagger';
import { CreateTeacherDto } from './create-student.dto';

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {}