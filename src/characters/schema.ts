import { z } from '@hono/zod-openapi'

// export const MonsterIdSchema = z.number().min(1001, "Minimum Monster ID is 1001").max(1602, "Maximum Monster ID is 1602").openapi({example: 1002});

// const MonsterIdParams = z.string().regex(/^\d+$/, "ID must be a numeric string").openapi({example: "1002"});

// export const MonsterIdParamsSchema =  z.object({
//     id: MonsterIdParams
// });

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