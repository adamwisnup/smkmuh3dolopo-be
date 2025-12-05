import { Controller, Get, Query, HttpException, HttpStatus, Param, Post, Body, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { GetAllStudentService } from '../services/getAll-student.service';
import { ResponseSuccess, ResponseError } from '../../../utils/response';
import { AppLogger } from '../../../utils/logger';
import { GetByIdStudentService } from '../services/getById-student.service';
import { CreateStudentService } from '../services/create-student.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentService } from '../services/update-student.service';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { DeleteStudentService } from '../services/delete-student.service';
import { RegisterCountStudentService } from '../services/registerCount-student.service';
import { LastWeekRegisterCountStudentService } from '../services/LastWeekRegisterCount-student.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../../decorators/roles.decorator';
import { RolesGuard } from '../../../guards/roles.guard';

@ApiTags('students')
@Controller('students')
export class StudentController {
  private readonly logger: AppLogger;

  constructor(
    private readonly getAllStudentsService: GetAllStudentService,
    private readonly getByIdStudentService: GetByIdStudentService,
    private readonly createStudentService: CreateStudentService,
    private readonly updateStudentService: UpdateStudentService,
    private readonly deleteStudentService: DeleteStudentService,
    private readonly registerCountStudentService: RegisterCountStudentService,
    private readonly lastWeekRegisterCountStudentService: LastWeekRegisterCountStudentService,
  ) {
    this.logger = new AppLogger('StudentController');
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get all students with pagination (Super Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({ status: 200, description: 'List of students with pagination.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getAll(@Query() query: { page?: string; limit?: string }): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: GET /students', { query });

      const page = query.page ? parseInt(query.page, 10) : 1;
      const limit = query.limit ? parseInt(query.limit, 10) : 10;
      if (page < 1 || limit < 1) {
        throw new HttpException('Invalid pagination parameters', HttpStatus.BAD_REQUEST);
      }

      const result = await this.getAllStudentsService.execute({ page, limit });

      this.logger.log('API: Successfully returned students', { count: result.data.length });

      return {
        meta: {
          code: 200,
          success: true,
          message: 'Students retrieved successfully',
        },
        data: result,
      };
    } catch (error) {
      this.logger.error('API: Error in GET /students', error);

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
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get student by ID (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Student details.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async getById(@Param('id') id: string): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log(`API: GET /students/${id}`);
      const student = await this.getByIdStudentService.execute(id);

      if (!student) {
        this.logger.warn(`API: Student not found (id: ${id})`);
        throw new HttpException('Student not found', HttpStatus.NOT_FOUND);
      }
      this.logger.log(`API: Successfully returned student (id: ${id})`);

      return {
        meta: {
          code: 200,
          success: true,
          message: 'Student retrieved successfully',
        },
        data: student,
      };
    } catch (error) {
      this.logger.error(`API: Error in GET /students/${id}`, error);
      return {
        meta: {
          code: error.status || 500,
          success: false,
          message: error.message || 'Internal server error',
        },
      };
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new student' })
  @ApiResponse({ status: 201, description: 'Student created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async create(@Body() dto: CreateStudentDto): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: POST /students', { dto });
      const newStudent = await this.createStudentService.execute(dto);
      this.logger.log('API: Successfully created student', { id: newStudent.id });
      return {
        meta: {
          code: 201,
          success: true,
          message: 'Student created successfully',
        },
        data: newStudent,
      };
    } catch (error) {
      this.logger.error('API: Error in POST /students', error);
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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Update an existing student (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Student updated successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  async update(@Param('id') id: string, @Body() dto: UpdateStudentDto): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log(`API: PATCH /students/${id}`, { dtoKeys: Object.keys(dto) });
      const updatedStudent = await this.updateStudentService.execute(id, dto);
      this.logger.log(`API: Successfully updated student (id: ${id})`);
      return {
        meta: { code: 200, success: true, message: 'Student updated successfully' },
        data: updatedStudent,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(`API: Student not found (id: ${id})`);
        return { meta: { code: 404, success: false, message: 'Student not found' } };
      }
      this.logger.error(`API: Error in PATCH /students/${id}`, error);
      return {
        meta: { code: error.status || 500, success: false, message: error.message || 'Internal server error' },
      };
    }
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Delete a student (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Student deleted successfully.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  @ApiResponse({ status: 404, description: 'Student not found.' })
  async delete(@Param('id') id: string): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log(`API: DELETE /students/${id}`);
      await this.deleteStudentService.execute(id);
      this.logger.log(`API: Successfully deleted student (id: ${id})`);
      return {
        meta: { code: 200, success: true, message: 'Student deleted successfully' },
      };
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(`API: Student not found (id: ${id})`);
        return { meta: { code: 404, success: false, message: 'Student not found' } };
      }
      this.logger.error(`API: Error in DELETE /students/${id}`, error);
      return {
        meta: { code: error.status || 500, success: false, message: error.message || 'Internal server error' },
      };
    }
  }

  @Get('stats/registered-count')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get total registered students count (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Total registered students count.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  async getRegisteredCount(): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: GET /students/stats/registered-count');
      const count = await this.registerCountStudentService.execute();
      this.logger.log('API: Successfully retrieved registered students count', { count });
      return {
        meta: { code: 200, success: true, message: 'Registered students count retrieved successfully' },
        data: { count },
      };
    } catch (error) {
      this.logger.error('API: Error in GET /students/stats/registered-count', error);
      return {
        meta: { code: error.status || 500, success: false, message: error.message || 'Internal server error' },
      };
    }
  }

  @Get('stats/last-week-registered-count')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Get last week registered students count (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Last week registered students count.' })
  @ApiResponse({ status: 403, description: 'Forbidden - Super Admin access required' })
  async getLastWeekRegisteredCount(): Promise<ResponseSuccess | ResponseError> {
    try {
      this.logger.log('API: GET /students/stats/last-week-registered-count');
      const count = await this.lastWeekRegisterCountStudentService.execute();
      this.logger.log('API: Successfully retrieved last week registered students count', { count });
      return {
        meta: { code: 200, success: true, message: 'Last week registered students count retrieved successfully' },
        data: { count },
      };
    } catch (error) {
      this.logger.error('API: Error in GET /students/stats/last-week-registered-count', error);
      return {
        meta: { code: error.status || 500, success: false, message: error.message || 'Internal server error' },
      };
    }
  }
}