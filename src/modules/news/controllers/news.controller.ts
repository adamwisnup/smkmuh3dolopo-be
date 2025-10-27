import { Controller, Get, Query, HttpException, HttpStatus, Param, Post, Body, Patch, Delete } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppLogger } from '../../../utils/logger';
import { CreateNewsService } from "../services/create-news.service";
import { UpdateNewsService } from "../services/update-news.service";
import { DeleteNewsService } from "../services/delete-news.service";
import { GetAllNewsService } from "../services/getAll-news.service";
import { GetByIdNewsService } from "../services/getById-news.service";
import { CreateNewsDto } from "../dto/create-news.dto";
import { ResponseError, ResponseSuccess } from "src/utils/response";
import { UpdateNewsDto } from '../dto/update-news.dto';
import { PublishCountNewsService } from '../services/publishCount-news.service';
import { TotalCountNewsService } from '../services/totalCount-news.service';

@ApiTags("news")
@Controller("news")
export class NewsController {
  private readonly logger: AppLogger;

  constructor(
    private readonly createNewsService: CreateNewsService,
    private readonly updateNewsService: UpdateNewsService,
    private readonly deleteNewsService: DeleteNewsService,
    private readonly getAllNewsService: GetAllNewsService,
    private readonly getByIdNewsService: GetByIdNewsService,
    private readonly publishCountNewsService: PublishCountNewsService,
    private readonly totalCountNewsService: TotalCountNewsService,
  ) {
    this.logger = new AppLogger('NewsController');
  }

  @Post()
  @ApiOperation({ summary: 'Create a new news' })
  @ApiResponse({ status: 201, description: 'News created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async create(@Body() dto: CreateNewsDto): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: POST /news', { dto });
      const newNews = await this.createNewsService.execute(dto);
      this.logger.log('API: Successfully created news', { id: newNews.id });
      return {
        meta: {
          code: 201,
          success: true,
          message: 'News created successfully',
        },
        data: newNews,
      };
    } catch (error) {
      this.logger.error('API: Error in POST /news', error);
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
  @ApiOperation({ summary: 'Get all news with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'News retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAll(@Query() query: { page?: string; limit?: string }): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: GET /news', { query });
      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = query.limit ? parseInt(query.limit, 10) : 10;
      if (page < 1 || limit < 1) {
        throw new HttpException('Invalid pagination parameters', HttpStatus.BAD_REQUEST);
      }
      const newsList = await this.getAllNewsService.execute({ page, limit });
      this.logger.log('API: Successfully retrieved news', { count: newsList.data.length });
      return {
        meta: {
          code: 200,
          success: true,
          message: 'News retrieved successfully',
        },
        data: newsList,
      };
    } catch (error) {
      this.logger.error('API: Error in GET /news', error);
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
  @ApiOperation({ summary: 'Get news by ID' })
  @ApiResponse({ status: 200, description: 'News retrieved successfully' })
  @ApiResponse({ status: 404, description: 'News not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getById(@Param('id') id: string): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: GET /news/:id', { id });
      const newsItem = await this.getByIdNewsService.execute(id);
      if (!newsItem) {
        this.logger.warn(`API: News not found (id: ${id})`);
        throw new HttpException('News not found', HttpStatus.NOT_FOUND);
      }
      this.logger.log(`API: Successfully retrieved news (id: ${id})`);
      return {
        meta: {
          code: 200,
          success: true,
          message: 'News retrieved successfully',
        },
        data: newsItem,
      };
    } catch (error) {
      this.logger.error('API: Error in GET /news/:id', error);
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
  @ApiOperation({ summary: 'Update news by ID' })
  @ApiResponse({ status: 200, description: 'News updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'News not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async update(@Param('id') id: string, @Body() dto: UpdateNewsDto): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: PATCH /news/:id', { id, dto });
      const updatedNews = await this.updateNewsService.execute(id, dto);
      if (!updatedNews) {
        this.logger.warn(`API: News not found (id: ${id})`);
        throw new HttpException('News not found', HttpStatus.NOT_FOUND);
      }
      this.logger.log(`API: Successfully updated news (id: ${id})`);
      return {
        meta: {
          code: 200,
          success: true,
          message: 'News updated successfully',
        },
        data: updatedNews,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(`API: Teacher not found (id: ${id})`);
        return {
          meta: {
            code: 404,
            success: false,
            message: 'Teacher not found',
          },
        };
      }
      this.logger.error('API: Error in PATCH /news/:id', error);
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
  @ApiOperation({ summary: 'Delete news by ID' })
  @ApiResponse({ status: 200, description: 'News deleted successfully' })
  @ApiResponse({ status: 404, description: 'News not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async delete(@Param('id') id: string): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: DELETE /news/:id', { id });
      const deletedNews = await this.deleteNewsService.execute(id);
      this.logger.log(`API: Successfully deleted news (id: ${id})`);
      return {
        meta: {
          code: 200,
          success: true,
          message: 'News deleted successfully',
        },
        data: deletedNews,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(`API: News not found (id: ${id})`);
        return {
          meta: {
            code: 404,
            success: false,
            message: 'News not found',
          },
        };
      }
      this.logger.error('API: Error in DELETE /news/:id', error);
      return {
        meta: {
          code: error.status || 500,
          success: false,
          message: error.message || 'Internal server error',
        },
      };
    }
  }

  @Get('stats/published-count')
  @ApiOperation({ summary: 'Get count of published news' })
  @ApiResponse({ status: 200, description: 'Published news count retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getPublishedCount(): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: GET /news/stats/published-count');
      const count = await this.publishCountNewsService.execute();
      this.logger.log('API: Successfully retrieved published news count', { count });
      return {
        meta: {
          code: 200,
          success: true,
          message: 'Published news count retrieved successfully',
        },
        data: { publishedCount: count },
      };
    } catch (error) {
      this.logger.error('API: Error in GET /news/stats/published-count', error);
      return {
        meta: {
          code: error.status || 500,
          success: false,
          message: error.message || 'Internal server error',
        },
      };
    }
  }

  @Get('stats/total-count')
  @ApiOperation({ summary: 'Get total count of news' })
  @ApiResponse({ status: 200, description: 'Total news count retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getTotalCount(): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: GET /news/stats/total-count');
      const count = await this.totalCountNewsService.execute();
      this.logger.log('API: Successfully retrieved total news count', { count });
      return {
        meta: {
          code: 200,
          success: true,
          message: 'Total news count retrieved successfully',
        },
        data: { totalCount: count },
      };
    } catch (error) {
      this.logger.error('API: Error in GET /news/stats/total-count', error);
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