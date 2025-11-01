import { Prisma, Admin } from "../../../generated/prisma";

export interface IAdminQueryRepository {
  findByEmail(email: string): Promise<Admin | null>;
}