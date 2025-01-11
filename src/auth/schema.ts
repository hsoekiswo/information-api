import { z } from '@hono/zod-openapi';

export const LoginSchema = z.object({
    username: z.string().min(4, "Username minimum have 4 characters").openapi({example: 'admin'}),
    password: z.string().min(1, "Password cannot be empty").openapi({ example: "admin" }),
});