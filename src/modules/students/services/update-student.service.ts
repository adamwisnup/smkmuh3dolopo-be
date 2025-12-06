import { Injectable, NotFoundException } from "@nestjs/common";
import { StudentCommandRepository } from "src/repositories/students/command.student";
import { StudentQueryRepository } from "src/repositories/students/query.student";
import { AppLogger } from "../../../utils/logger";
import { UpdateStudentDto } from "../dto/update-student.dto";
import { Student } from "../../../../generated/prisma";

@Injectable()
export class UpdateStudentService {
  private readonly logger: AppLogger;

  constructor(
    private readonly commandRepo: StudentCommandRepository,
    private readonly queryRepo: StudentQueryRepository,
  ) {
    this.logger = new AppLogger('UpdateStudentService');
  }

  async execute(id: string, dto: UpdateStudentDto): Promise<Student> {
    try {
      this.logger.log('Service: Executing update student', { id, dto });

      // Get existing student first
      const existingStudent = await this.queryRepo.findById(id);
      if (!existingStudent) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }

      // Create update payload with fallback to existing values
      const updatePayload: Partial<Student> = {
        name: dto.name ?? existingStudent.name,
        gender: dto.gender ?? existingStudent.gender,
        place_of_birth: dto.place_of_birth ?? existingStudent.place_of_birth,
        date_of_birth: dto.date_of_birth ? new Date(dto.date_of_birth) : existingStudent.date_of_birth,
        address: dto.address ?? existingStudent.address,
        phone_number: dto.phone_number ?? existingStudent.phone_number,
        from_school: dto.from_school ?? existingStudent.from_school,
        graduation_year: dto.graduation_year ?? existingStudent.graduation_year,
        biological_father: dto.biological_father ?? existingStudent.biological_father,
        biological_mother: dto.biological_mother ?? existingStudent.biological_mother,
        father_condition: dto.father_condition ?? existingStudent.father_condition,
        mother_condition: dto.mother_condition ?? existingStudent.mother_condition,
        father_job: dto.father_job ?? existingStudent.father_job,
        mother_job: dto.mother_job ?? existingStudent.mother_job,
        parent_guardian_phone_number: dto.parent_guardian_phone_number ?? existingStudent.parent_guardian_phone_number,
        major: dto.major ?? existingStudent.major,
        recommendation_from: dto.recommendation_from ?? existingStudent.recommendation_from,
      };

      const updatedStudent = await this.commandRepo.update(id, updatePayload);
      this.logger.log('Service: Successfully updated student', { id });
      return updatedStudent;
    } catch (error) {
      this.logger.error('Service: Error executing update student', { id, error });
      throw error;
    }
  }
}