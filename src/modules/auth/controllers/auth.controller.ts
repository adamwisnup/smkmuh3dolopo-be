import { Controller, Get, Query, HttpException, HttpStatus, Param, Post, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ResponseSuccess, ResponseError } from '../../../utils/response';
import { AppLogger } from '../../../utils/logger';
import { LoginAdminService } from '../services/login-admin.service';
import { LoginAdminDto } from '../dto/login-admin.dto';
import { CreateAdminService } from '../services/create-admin.service';
import { UpdateAdminService } from '../services/update-admin.service';
import { DeleteAdminService } from '../services/delete-admin.service';
import { GetAllAdminService } from '../services/get-all-admin.service';
import { GetByIdAdminService } from '../services/get-by-id-admin.service';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../../decorators/roles.decorator';
import { RolesGuard } from '../../../guards/roles.guard';
import { CurrentUser } from '../../../decorators/current-user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger: AppLogger;

  constructor(
    private readonly loginAdminService: LoginAdminService,
    private readonly createAdminService: CreateAdminService,
    private readonly updateAdminService: UpdateAdminService,
    private readonly deleteAdminService: DeleteAdminService,
    private readonly getAllAdminService: GetAllAdminService,
    private readonly getByIdAdminService: GetByIdAdminService,
  ) {
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

  @Get('admin')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get all admins (Super Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'List of admins with pagination.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  async getAllAdmins(@Query() query: { page?: string; limit?: string }): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: GET /auth/admin', { query });

      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = query.limit ? parseInt(query.limit, 10) : 10;
      if (page < 1 || limit < 1) {
        throw new HttpException('Invalid pagination parameters', HttpStatus.BAD_REQUEST);
      }

      const result = await this.getAllAdminService.execute({ page, limit });

      this.logger.log('API: Successfully returned admins', { count: result.data.length });

      return {
        meta: {
          code: 200,
          success: true,
          message: 'Admins retrieved successfully',
        },
        data: result,
      };
    } catch (error) {
      this.logger.error('API: Error in GET /auth/admin', error);

      return {
        meta: {
          code: error.status || 500,
          success: false,
          message: error.message || 'Internal server error',
        },
      };
    }
  }

  @Get('admin/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get admin by ID (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Admin details.' })
  @ApiResponse({ status: 404, description: 'Admin not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  async getAdminById(@Param('id') id: string): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log(`API: GET /auth/admin/${id}`);
      const admin = await this.getByIdAdminService.execute(id);

      this.logger.log(`API: Successfully returned admin (id: ${id})`);

      return {
        meta: {
          code: 200,
          success: true,
          message: 'Admin retrieved successfully',
        },
        data: admin,
      };
    } catch (error) {
      this.logger.error(`API: Error in GET /auth/admin/${id}`, error);
      return {
        meta: {
          code: error.status || 500,
          success: false,
          message: error.message || 'Internal server error',
        },
      };
    }
  }

  @Post('admin')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Create a new admin (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Admin created successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  @ApiResponse({ status: 409, description: 'Admin with this email already exists.' })
  async createAdmin(@Body() dto: CreateAdminDto): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: POST /auth/admin', { dto });
      const newAdmin = await this.createAdminService.execute(dto);
      this.logger.log('API: Successfully created admin', { id: newAdmin.id });
      return {
        meta: {
          code: 201,
          success: true,
          message: 'Admin created successfully',
        },
        data: newAdmin,
      };
    } catch (error) {
      this.logger.error('API: Error in POST /auth/admin', error);
      return {
        meta: {
          code: error.status || 500,
          success: false,
          message: error.message || 'Internal server error',
        },
      };
    }
  }

  @Patch('admin/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Update an existing admin (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Admin updated successfully.' })
  @ApiResponse({ status: 404, description: 'Admin not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  async updateAdmin(@Param('id') id: string, @Body() dto: UpdateAdminDto, @CurrentUser() currentUser: any): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log(`API: PATCH /auth/admin/${id}`, { dtoKeys: Object.keys(dto) });

      // Prevent admin from updating their own role to prevent privilege escalation
      if (currentUser.id === id && dto.role) {
        return {
          meta: {
            code: 400,
            success: false,
            message: 'You cannot update your own role',
          },
        };
      }

      const updatedAdmin = await this.updateAdminService.execute(id, dto);
      this.logger.log(`API: Successfully updated admin (id: ${id})`);
      return {
        meta: { code: 200, success: true, message: 'Admin updated successfully' },
        data: updatedAdmin,
      };
    } catch (error) {
      this.logger.error(`API: Error in PATCH /auth/admin/${id}`, error);
      return {
        meta: { code: error.status || 500, success: false, message: error.message || 'Internal server error' },
      };
    }
  }

  @Delete('admin/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete an admin (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Admin not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  async deleteAdmin(@Param('id') id: string, @CurrentUser() currentUser: any): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log(`API: DELETE /auth/admin/${id}`);

      // Prevent admin from deleting themselves
      if (currentUser.id === id) {
        return {
          meta: {
            code: 400,
            success: false,
            message: 'You cannot delete your own account',
          },
        };
      }

      await this.deleteAdminService.execute(id);
      this.logger.log(`API: Successfully deleted admin (id: ${id})`);
      return {
        meta: { code: 200, success: true, message: 'Admin deleted successfully' },
      };
    } catch (error) {
      this.logger.error(`API: Error in DELETE /auth/admin/${id}`, error);
      return {
        meta: { code: error.status || 500, success: false, message: error.message || 'Internal server error' },
      };
    }
  }
}