import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RepositoryModule } from 'src/repositories/repository.module';
import { LoginAdminService } from './services/login-admin.service';
import { GenerateTokenService } from './services/generate-jwt.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './services/jwt.strategy.service';
import { CreateAdminService } from './services/create-admin.service';
import { UpdateAdminService } from './services/update-admin.service';
import { DeleteAdminService } from './services/delete-admin.service';
import { GetAllAdminService } from './services/get-all-admin.service';
import { GetByIdAdminService } from './services/get-by-id-admin.service';
import { AdminCommandRepository } from '../../repositories/admins/command.admin';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    RepositoryModule,
  ],
  controllers: [AuthController],
  providers: [
    GenerateTokenService,
    LoginAdminService,
    JwtStrategy,
    CreateAdminService,
    UpdateAdminService,
    DeleteAdminService,
    GetAllAdminService,
    GetByIdAdminService,
    AdminCommandRepository,
  ],
})
export class AuthModule {}