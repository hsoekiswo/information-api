import { z } from 'zod';
import { DatabaseError } from 'pg';
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

  if (c.req.method === 'POST' && error instanceof DatabaseError) {
    console.error('Database Error:', error.message);
    return {
      status: 500,
      body: {
        error: 'Database Error',
        code: error.code,
        details: error.message || 'No additional details provided.',
        hint: error.hint || 'No hints available.',
      },
    };
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