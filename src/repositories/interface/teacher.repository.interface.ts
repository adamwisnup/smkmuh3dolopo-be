import { Prisma, Teacher } from "../../../generated/prisma";

export interface ITeacherQueryRepository {
  findAll(options?: { page?: number; limit?: number }): Promise<{ data: Teacher[]; pagination: any }>;
  findById(id: string): Promise<Teacher | null>;
}

export interface ITeacherCommandRepository {
  create(data: Prisma.TeacherCreateInput): Promise<Teacher>;
  update(id: string, data: Prisma.TeacherUpdateInput): Promise<Teacher>;
  delete(id: string): Promise<Teacher>;
}