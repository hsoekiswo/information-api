import { PrismaClient } from '@prisma/client';
import dotenv, { config }  from 'dotenv';

config();
export const apiKey = process.env.API_KEY;

dotenv.config({ path: '../.env' });

const prisma = new PrismaClient();

async function connectDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('Connected to the database');
  } catch (error: unknown) {
    console.error('Failed to connect to the database:', (error as Error).message);
    process.exit(1);
  }
}

connectDatabase();

export default prisma;