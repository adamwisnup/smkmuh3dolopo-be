import { Prisma, Career } from "../../../generated/prisma";

export interface ICareerQueryRepository {
  findAll(options?: { page?: number; limit?: number }): Promise<{ data: Career[]; pagination: any }>;
  findById(id: string): Promise<Career | null>;
}

export interface ICareerCommandRepository {
  create(data: Prisma.CareerCreateInput): Promise<Career>;
  update(id: string, data: Prisma.CareerUpdateInput): Promise<Career>;
  delete(id: string): Promise<Career>;
}