import { Controller, Get, Query, HttpException, HttpStatus, Param, Post, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppLogger } from '../../../utils/logger';
import { CreateTeacherService } from "../services/create-teacher.service";
import { UpdateTeacherService } from "../services/update-teacher.service";
import { DeleteTeacherService } from "../services/delete-teacher.service";
import { GetAllTeacherService } from "../services/getAll-teacher.service";
import { GetByIdTeacherService } from "../services/getById-teacher.service";
import { CreateTeacherDto } from "../dto/create-student.dto";
import { ResponseError, ResponseSuccess } from "src/utils/response";
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags("teachers")
@Controller("teachers")
export class TeacherController {
  private readonly logger: AppLogger;

  constructor(
    private readonly createTeacherService: CreateTeacherService,
    private readonly updateTeacherService: UpdateTeacherService,
    private readonly deleteTeacherService: DeleteTeacherService,
    private readonly getAllTeacherService: GetAllTeacherService,
    private readonly getByIdTeacherService: GetByIdTeacherService,
  ) {
    this.logger = new AppLogger('TeacherController');
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new teacher' })
  @ApiResponse({ status: 201, description: 'Teacher created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async create(@Body() dto: CreateTeacherDto): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: POST /teachers', { dto });
      const newTeacher = await this.createTeacherService.execute(dto);
      this.logger.log('API: Successfully created teacher', { id: newTeacher.id });
      return {
        meta: {
          code: 201,
          success: true,
          message: 'Teacher created successfully',
        },
        data: newTeacher,
      };
    } catch (error) {
      this.logger.error('API: Error in POST /teachers', error);
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
  @ApiOperation({ summary: 'Get all teachers with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'List of teachers with pagination.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAll(@Query() query: { page?: string; limit?: string }): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: GET /teachers', { query });
      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = query.limit ? parseInt(query.limit, 10) : 10;
      if (page < 1 || limit < 1) {
        throw new HttpException('Invalid pagination parameters', HttpStatus.BAD_REQUEST);
      }
      const result = await this.getAllTeacherService.execute({ page, limit });
      this.logger.log('API: Successfully returned teachers', { count: result.data.length });
      return {
        meta: {
          code: 200,
          success: true,
          message: 'Teachers retrieved successfully',
        },
        data: result,
      };
    } catch (error) {
      this.logger.error('API: Error in GET /teachers', error);
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
  @ApiOperation({ summary: 'Get teacher by ID' })
  @ApiResponse({ status: 200, description: 'Teacher details.' })
  @ApiResponse({ status: 404, description: 'Teacher not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getById(@Param('id') id: string): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log(`API: GET /teachers/${id}`);
      const teacher = await this.getByIdTeacherService.execute(id);
      if (!teacher) {
        this.logger.warn(`API: Teacher not found (id: ${id})`);
        throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND);
      }
      this.logger.log(`API: Successfully returned teacher (id: ${id})`);
      return {
        meta: {
          code: 200,
          success: true,
          message: 'Teacher retrieved successfully',
        },
        data: teacher,
      };
    } catch (error) {
      this.logger.error(`API: Error in GET /teachers/${id}`, error);
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
  @ApiOperation({ summary: 'Update an existing teacher' })
  @ApiResponse({ status: 200, description: 'Teacher updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Teacher not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async update(@Param('id') id: string, @Body() dto: UpdateTeacherDto): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log(`API: PATCH /teachers/${id}`, { dto });
      const updatedTeacher = await this.updateTeacherService.execute(id, dto);
      if (!updatedTeacher) {
        this.logger.warn(`API: Teacher not found (id: ${id})`);
        throw new HttpException('Teacher not found', HttpStatus.NOT_FOUND);
      }
      this.logger.log(`API: Successfully updated teacher (id: ${id})`);
      return {
        meta: {
          code: 200,
          success: true,
          message: 'Teacher updated successfully',
        },
        data: updatedTeacher,
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
      this.logger.error(`API: Error in PATCH /teachers/${id}`, error);
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
  @ApiOperation({ summary: 'Delete a teacher' })
  @ApiResponse({ status: 200, description: 'Teacher deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Teacher not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async delete(@Param('id') id: string): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log(`API: DELETE /teachers/${id}`);
      await this.deleteTeacherService.execute(id);
      this.logger.log(`API: Successfully deleted teacher (id: ${id})`);
      return {
        meta: {
          code: 200,
          success: true,
          message: 'Teacher deleted successfully',
        },
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
      this.logger.error(`API: Error in DELETE /teachers/${id}`, error);
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