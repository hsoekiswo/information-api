import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { Context } from 'hono';

interface ErrorResponse {
  status: number;
  body: Record<string, unknown>;
}

export const handleError = (error: unknown, c: Context): ErrorResponse => {
  if (error instanceof z.ZodError) {
    console.error('Validation Error:', error.errors);
    return {
      status: 400,
      body: {
        error: 'Validation Error',
        details: error.errors,
      },
    };
  }

  if (c.req.method === 'POST') {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma Known Request Error:', error.message);
      return {
        status: 500,
        body: {
          error: 'Prisma Client Known Request Error',
          code: error.code,
          details: error.message || 'No additional details provided.',
          meta: error.meta || 'No metadata available.',
      },
    };
  }

  if (
      error instanceof Prisma.PrismaClientUnknownRequestError ||
      error instanceof Prisma.PrismaClientRustPanicError ||
      error instanceof Prisma.PrismaClientInitializationError ||
      error instanceof Prisma.PrismaClientValidationError
    ) {
      console.error('Prisma Error:', error.message);
      return {
        status: 500,
        body: {
          error: 'Database Error',
          details: error.message || 'An unknown error occurred.',
        },
      };
    }
  }

  console.error('Unhandled Error:', error);
  return {
    status: 500,
    body: {
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'production' ? undefined : (error as Error).message,
    },
  };
};