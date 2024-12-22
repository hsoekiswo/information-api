import { z } from "@hono/zod-openapi";

const LevelSchema = z.number().min(0).max(150, "Level must be between 0 and 150");

export const LevelParamsSchema = z.object({
    level: z.string().regex(/^\d+$/, "ID must be a numeric string"),
})

export const ExperiencesSchema = z.object({
    experienceId: z.number().positive("Experience ID cannot be empty and contains positive numbers"),
    level: LevelSchema,
    experience: z.number().positive("Experience must be positive number"),
    expType: z.string().min(1, "Experience type cannot be empty"),
})