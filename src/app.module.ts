import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './modules/students/student.module';
import { TeacherModule } from './modules/teachers/teacher.module';
import { SocialMediaModule } from './modules/socialMedia/socialMedia.module';
import { NewsModule } from './modules/news/news.module';
import { AuthModule } from './modules/auth/auth.module';
import { CareerModule } from './modules/careers/career.module';

@Module({
  imports: [
    StudentModule,
    TeacherModule,
    SocialMediaModule,
    NewsModule,
    AuthModule,
    CareerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}