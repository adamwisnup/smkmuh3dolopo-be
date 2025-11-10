import { News } from './../../generated/prisma/index.d';
// /src/repositories/student/student.repository.module.ts
import { Module } from '@nestjs/common';
import { StudentQueryRepository } from './students/query.student';
import { StudentCommandRepository } from './students/command.student';
import { TeacherCommandRepository } from './teachers/command.teacher';
import { TeacherQueryRepository } from './teachers/query.teacher';
import { SocialMediaCommandRepository } from './socialMedia/command.socialMedia';
import { SocialMediaQueryRepository } from './socialMedia/query.socialMedia';
import { NewsCommandRepository } from './news/command.news';
import { NewsQueryRepository } from './news/query.news';
import { AdminQueryRepository } from './admins/query.admin';
import { CareerCommandRepository } from './careers/command.career';
import { CareerQueryRepository } from './careers/query.career';

@Module({
  providers: [
    StudentQueryRepository, StudentCommandRepository,
    TeacherCommandRepository, TeacherQueryRepository,
    SocialMediaCommandRepository, SocialMediaQueryRepository,
    NewsCommandRepository, NewsQueryRepository,
    AdminQueryRepository,
    CareerCommandRepository, CareerQueryRepository,
  ],
  exports: [
    StudentQueryRepository, StudentCommandRepository,
    TeacherCommandRepository, TeacherQueryRepository,
    SocialMediaCommandRepository, SocialMediaQueryRepository,
    NewsCommandRepository, NewsQueryRepository,
    AdminQueryRepository,
    CareerCommandRepository, CareerQueryRepository,
  ],
})
export class RepositoryModule {}