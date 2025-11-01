import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RepositoryModule } from 'src/repositories/repository.module';
import { LoginAdminService } from './services/login-admin.service';
import { GenerateTokenService } from './services/generate-jwt.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './services/jwt.strategy.service';

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
  ],
})
export class AuthModule {}