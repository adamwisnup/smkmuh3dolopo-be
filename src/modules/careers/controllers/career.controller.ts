import { Controller, Get, Query, HttpException, HttpStatus, Param, Post, Body, Patch, Delete, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ResponseSuccess, ResponseError } from '../../../utils/response';
import { AppLogger } from '../../../utils/logger';
import { AuthGuard } from '@nestjs/passport';
import { CreateCareerService } from '../services/create-career.service';
import { GetByIdCareerService } from '../services/getById-carrer.service';
import { UpdateCareerService } from '../services/update-career.service';
import { DeleteCareerService } from '../services/delete-career.service';
import { GetAllCareerService } from '../services/getAll-career.service';
import { CreateCareerDto } from '../dto/create-career.dto';
import { UpdateCareerDto } from '../dto/update-career.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('careers')
@Controller('careers')
export class CareerController {
  private readonly logger: AppLogger;

  constructor(
    private readonly createCareerService: CreateCareerService,
    private readonly getByIdCareerService: GetByIdCareerService,
    private readonly updateCareerService: UpdateCareerService,
    private readonly deleteCareerService: DeleteCareerService,
    private readonly getAllCareerService: GetAllCareerService, 
  ) {
    this.logger = new AppLogger('SocialMediaController');
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new career' })
  @ApiResponse({ status: 201, description: 'Career created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async create(@Body() dto: CreateCareerDto, @UploadedFile() photo: Express.Multer.File): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: POST /careers', { dto });
      const newCareer = await this.createCareerService.execute({
        ...dto,
        photo,
      });
      this.logger.log('API: Successfully created career', { id: newCareer.id });
      return {
        meta: {
          code: 201,
          success: true,
          message: 'Career created successfully',
        },
        data: newCareer,
      };
    } catch (error) {
      this.logger.error('API: Error in POST /careers', error);
      return {
        meta: {
          code: error.status || 500,
          success: false,
          message: error.message || 'Internal server error',
        },
      };
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all careers with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number for pagination' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Number of items per page' })
  @ApiResponse({ status: 200, description: 'Careers retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAll(@Query() query: { page?: string; limit?: string }): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: GET /careers', { query });
      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = query.limit ? parseInt(query.limit, 10) : 10;
      if (page < 1 || limit < 1) {
        throw new HttpException('Invalid pagination parameters', HttpStatus.BAD_REQUEST);
      }
      const result = await this.getAllCareerService.execute({ page, limit });

      this.logger.log('API: Successfully returned careers', { count: result.data.length });
      return {
        meta: {
          code: 200,
          success: true,
          message: 'Careers retrieved successfully',
        },
        data: result,
      };
    } catch (error) {
      this.logger.error('API: Error in GET /careers', error);
      return {
        meta: {
          code: error.status || 500,
          success: false,
          message: error.message || 'Internal server error',
        },
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get career by ID' })
  @ApiResponse({ status: 200, description: 'Career retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Career not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getById(@Param('id') id: string): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log(`API: GET /careers/${id}`);
      const career = await this.getByIdCareerService.execute(id);
      if (!career) {
        this.logger.warn(`API: Career not found (id: ${id})`);
        throw new HttpException('Career not found', HttpStatus.NOT_FOUND);
      }
      this.logger.log(`API: Successfully returned career (id: ${id})`);
      return {
        meta: {
          code: 200,
          success: true,
          message: 'Career retrieved successfully',
        },
        data: career,
      };
    } catch (error) {
      this.logger.error(`API: Error in GET /careers/${id}`, error);
      return {
        meta: {
          code: error.status || 500,
          success: false,
          message: error.message || 'Internal server error',
        },
      };
    }
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update career by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Career ID' })
  @ApiResponse({ status: 200, description: 'Career updated successfully' })
  @ApiResponse({ status: 404, description: 'Career not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async update(@Param('id') id: string, @Body() dto: UpdateCareerDto, @UploadedFile() photo: Express.Multer.File): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log(`API: PATCH /careers/${id}`, { dto });

      const updatedCareer = await this.updateCareerService.execute(id, {
        ...dto,
        photo,
      });

      if(!updatedCareer) {
        this.logger.warn(`API: Career not found (id: ${id})`);
        throw new HttpException('Career not found', HttpStatus.NOT_FOUND);
      }

      this.logger.log(`API: Successfully updated career (id: ${id})`);
      return {
        meta: {
          code: 200,
          success: true,
          message: 'Career updated successfully',
        },
        data: updatedCareer,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(`API: Career not found for update (id: ${id})`);
        return {
          meta: {
            code: 404,
            success: false,
            message: 'Career not found',
          },
        };
      }
      this.logger.error(`API: Error in PATCH /careers/${id}`, error);
      return {
        meta: {
          code: error.status || 500,
          success: false,
          message: error.message || 'Internal server error',
        },
      };
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a career' })
  @ApiParam({ name: 'id', type: String, description: 'Career ID' })
  @ApiResponse({ status: 200, description: 'Career deleted successfully' })
  @ApiResponse({ status: 404, description: 'Career not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async delete(@Param('id') id: string): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log(`API: DELETE /careers/${id}`);
      await this.deleteCareerService.execute(id);
      this.logger.log(`API: Successfully deleted career (id: ${id})`);
      return {
        meta: {
          code: 200,
          success: true,
          message: 'Career deleted successfully',
        },
      };
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(`API: Career not found for deletion (id: ${id})`);
        return {
          meta: {
            code: 404,
            success: false,
            message: 'Career not found',
          },
        };
      }
      this.logger.error(`API: Error in DELETE /careers/${id}`, error);
      return {
        meta: {
          code: error.status || 500,
          success: false,
          message: error.message || 'Internal server error',
        },
      };
    }
  }
}