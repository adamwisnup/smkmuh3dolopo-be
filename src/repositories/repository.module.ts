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

@Module({
  providers: [
    StudentQueryRepository, StudentCommandRepository,
    TeacherCommandRepository, TeacherQueryRepository,
    SocialMediaCommandRepository, SocialMediaQueryRepository,
    NewsCommandRepository, NewsQueryRepository,
  ],
  exports: [
    StudentQueryRepository, StudentCommandRepository,
    TeacherCommandRepository, TeacherQueryRepository,
    SocialMediaCommandRepository, SocialMediaQueryRepository,
    NewsCommandRepository, NewsQueryRepository,
  ],
})
export class RepositoryModule {}