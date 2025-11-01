import { Controller, Get, Query, HttpException, HttpStatus, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { ResponseSuccess, ResponseError } from '../../../utils/response';
import { AppLogger } from '../../../utils/logger';
import { LoginAdminService } from '../services/login-admin.service';
import { LoginAdminDto } from '../dto/login-admin.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger: AppLogger;

  constructor(private readonly loginAdminService: LoginAdminService) {
    this.logger = new AppLogger('AuthController');
  }

  @Post('login/admin')
  @ApiOperation({ summary: 'Admin login' })
  @ApiResponse({ status: 200, description: 'Admin logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async loginAdmin(@Body() dto: LoginAdminDto): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: POST /auth/login/admin', { dto });
      const result = await this.loginAdminService.execute(dto);

      this.logger.log('API: Admin login successful', { email: dto.email });
      return {
        meta: {
          code: 200,
          success: true,
          message: 'Admin logged in successfully',
        },
        data: result,
      };
    } catch (error) {
      this.logger.error('API: Error during admin login', { dto, error });
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}