import { Prisma, News, StatusNews } from "../../../generated/prisma";

export interface INewsQueryRepository {
  findAll(options?: { page?: number; limit?: number }): Promise<{ data: News[]; pagination: any }>;
  findById(id: string): Promise<News | null>;
  totalNewsCount(): Promise<number>;
  publishNewsCount(): Promise<number>;
  findPublishedNews(options?: { page?: number; limit?: number }): Promise<{ data: News[]; pagination: any }>;
}

export interface INewsCommandRepository {
  create(data: Prisma.NewsCreateInput): Promise<News>;
  update(id: string, data: Prisma.NewsCreateInput): Promise<News>;
  delete(id: string): Promise<News>;
}