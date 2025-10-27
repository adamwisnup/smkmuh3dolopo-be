import { Controller, Get, Query, HttpException, HttpStatus, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { ResponseSuccess, ResponseError } from '../../../utils/response';
import { AppLogger } from '../../../utils/logger';
import { GetByIdSocialMediaService } from '../services/getById-socialMedia.service';
import { UpdateSocialMediaService } from '../services/update-socialMedia.service';
import { DeleteSocialMediaService } from '../services/delete-socialMedia.service';
import { CreateSocialMediaService } from '../services/create-socialMedia.service';
import { GetAllSocialMediaService } from '../services/getAll-socialMedia.service';
import { CreateSocialMediaDto } from '../dto/create-socialMedia.dto';
import { UpdateSocialMediaDto } from '../dto/update-socialMedia.dto';

@ApiTags('social-media')
@Controller('social-media')
export class SocialMediaController {
  private readonly logger: AppLogger;

  constructor(
    private readonly getByIdSocialMediaService: GetByIdSocialMediaService,
    private readonly updateSocialMediaService: UpdateSocialMediaService,
    private readonly deleteSocialMediaService: DeleteSocialMediaService,
    private readonly createSocialMediaService: CreateSocialMediaService,
    private readonly getAllSocialMediaService: GetAllSocialMediaService,
  ) {
    this.logger = new AppLogger('SocialMediaController');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new social media' })
  @ApiResponse({ status: 201, description: 'Social media created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async create(@Body() dto: CreateSocialMediaDto): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: POST /social-media', { dto });
      const newSocialMedia = await this.createSocialMediaService.execute(dto);
      this.logger.log('API: Successfully created social media', { id: newSocialMedia.id });
      return {
        meta: {
          code: 201,
          success: true,
          message: 'Social media created successfully',
        },
        data: newSocialMedia,
      };
    } catch (error) {
      this.logger.error('API: Error in POST /social-media', error);
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
  @ApiOperation({ summary: 'Get all social media with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'List of social media with pagination.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAll(@Query() query: { page?: string; limit?: string }): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: GET /social-media', { query });
      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = query.limit ? parseInt(query.limit, 10) : 10;
      if (page < 1 || limit < 1) {
        throw new HttpException('Invalid pagination parameters', HttpStatus.BAD_REQUEST);
      }
      const result = await this.getAllSocialMediaService.execute({ page, limit });

      this.logger.log('API: Successfully returned social media', { count: result.data.length });
      return {
        meta: {
          code: 200,
          success: true,
          message: 'Social media retrieved successfully',
        },
        data: result,
      };
    } catch (error) {
      this.logger.error('API: Error in GET /social-media', error);
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
  @ApiOperation({ summary: 'Get social media by ID' })
  @ApiResponse({ status: 200, description: 'Social media details.' })
  @ApiResponse({ status: 404, description: 'Social media not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getById(@Param('id') id: string): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log(`API: GET /social-media/${id}`);
      const socialMedia = await this.getByIdSocialMediaService.execute(id);
      if (!socialMedia) {
        this.logger.warn(`API: Social media not found (id: ${id})`);
        throw new HttpException('Social media not found', HttpStatus.NOT_FOUND);
      }
      this.logger.log(`API: Successfully returned social media (id: ${id})`);
      return {
        meta: {
          code: 200,
          success: true,
          message: 'Social media retrieved successfully',
        },
        data: socialMedia,
      };
    } catch (error) {
      this.logger.error(`API: Error in GET /social-media/${id}`, error);
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
  @ApiOperation({ summary: 'Update social media by ID' })
  @ApiResponse({ status: 200, description: 'Social media updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Social media not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async update(@Param('id') id: string, @Body() dto: UpdateSocialMediaDto): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log(`API: PATCH /social-media/${id}`, { dto });
      const updatedSocialMedia = await this.updateSocialMediaService.execute(id, dto);
      this.logger.log(`API: Successfully updated social media (id: ${id})`);
      return {
        meta: {
          code: 200,
          success: true,
          message: 'Social media updated successfully',
        },
        data: updatedSocialMedia,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(`API: Social media not found for update (id: ${id})`);
        return {
          meta: {
            code: 404,
            success: false,
            message: 'Social media not found',
          },
        };
      }
      this.logger.error(`API: Error in PATCH /social-media/${id}`, error);
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
  @ApiOperation({ summary: 'Delete social media by ID' })
  @ApiResponse({ status: 200, description: 'Social media deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Social media not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async delete(@Param('id') id: string): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log(`API: DELETE /social-media/${id}`);
      await this.deleteSocialMediaService.execute(id);
      this.logger.log(`API: Successfully deleted social media (id: ${id})`);
      return {
        meta: {
          code: 200,
          success: true,
          message: 'Social media deleted successfully',
        },
      };
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(`API: Social media not found for deletion (id: ${id})`);
        return {
          meta: {
            code: 404,
            success: false,
            message: 'Social media not found',
          },
        };
      }
      this.logger.error(`API: Error in DELETE /social-media/${id}`, error);
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