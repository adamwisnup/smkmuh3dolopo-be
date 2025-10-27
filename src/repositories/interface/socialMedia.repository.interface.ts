import { Prisma, SocialMedia } from "../../../generated/prisma";

export interface ISocialMediaQueryRepository {
  findAll(options?: { page?: number; limit?: number }): Promise<{ data: SocialMedia[]; pagination: any }>;
  findById(id: string): Promise<SocialMedia | null>;
}

export interface ISocialMediaCommandRepository {
  create(data: Prisma.SocialMediaCreateInput): Promise<SocialMedia>;
  update(id: string, data: Prisma.SocialMediaCreateInput): Promise<SocialMedia>;
  delete(id: string): Promise<SocialMedia>;
}