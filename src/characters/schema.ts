import { z } from '@hono/zod-openapi';

export const CharacterIdParams = z.object({
    id: z.string().regex(/^\d+$/, "ID must be a numeric string").openapi({example: "1"}),
});

export const CharacterIdSchema = z.number().positive().openapi({ example: 1 });

const LevelSchema = z.string().transform((val) => {
    const num = Number(val);
    if (isNaN(num)) {
        throw new Error("Invalid number");
    }
    return num;
}).refine((val) => val > 0, {
    message: "Must be a positive number",
});

export const CharacterFormSchema = z.object({
    name: z.string().min(1, "Name cannot be empty").openapi({example: "ijun"}),
    baseLevel: LevelSchema.openapi({example: "10"}),
    jobLevel: LevelSchema.openapi({example: "10"}),
});