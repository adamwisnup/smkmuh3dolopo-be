import { Prisma, Admin } from "../../../generated/prisma";
import { AdminResponse, AdminListResponse } from "../../types/admin.types";

export interface IAdminQueryRepository {
  findByEmail(email: string): Promise<Admin | null>;
  findById(id: string): Promise<AdminResponse | null>;
  findAll(options: { page?: number; limit?: number }): Promise<AdminListResponse>;
}

export interface IAdminCommandRepository {
  create(data: Prisma.AdminCreateInput): Promise<AdminResponse>;
  update(id: string, data: Prisma.AdminUpdateInput): Promise<AdminResponse>;
  delete(id: string): Promise<void>;
}