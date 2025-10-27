import * as dotenv from 'dotenv';
import { PrismaClient } from '../../generated/prisma';

dotenv.config();

const prisma = {
  databaseUrl: process.env.DATABASE_URL,
  prismaClient: new PrismaClient(),
};

export default prisma;