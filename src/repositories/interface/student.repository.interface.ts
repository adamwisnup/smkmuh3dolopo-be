import { Prisma, Student } from "../../../generated/prisma";

export interface IStudentQueryRepository {
  findAll(options?: { page?: number; limit?: number }): Promise<{ data: Student[]; pagination: any }>;
  findById(id: string): Promise<Student | null>;
  totalStudentRegisterCount(): Promise<number>;
  studentRegisterLastWeekCount(): Promise<number>;
}

export interface IStudentCommandRepository {
  create(data: Prisma.StudentCreateInput): Promise<Student>;
  update(id: string, data: Prisma.StudentCreateInput): Promise<Student>;
  delete(id: string): Promise<Student>;
}