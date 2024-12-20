import { z } from "@hono/zod-openapi";

export const MonsterIdSchema = z.number().min(1001, "Minimum Monster ID is 1001").max(1602, "Maximum Monster ID is 1602").openapi({example: 1002});

const MonsterIdParams = z.string().regex(/^\d+$/, "ID must be a numeric string");

export const MonsterIdParamsSchema =  z.object({
    id: MonsterIdParams
});

export const MonsterIdRangeParamsSchema = z.object({
    startId: MonsterIdParams,
    endId: MonsterIdParams,
})

export const MonsterSchema = z.object({
    monsterId: MonsterIdSchema,
    name: z.string().min(1, "Monster name cannot be empty").openapi({example: 'Poring'}),
    level: z.number().min(0).max(150, "Level must be between 0 and 150").openapi({example: 1}),
    hp: z.number().nonnegative("HP must be a non-negative number").openapi({example: 55}),
    attackMin: z.number().nonnegative("Minimum attack must be a non-negative number").openapi({example: 7}),
    attackMax: z.number().nonnegative("Maximum attack must be a non-negative number").openapi({example: 8}),
    defense: z.number().nonnegative("Defense must be a non-negative number").openapi({example: 2}),
    magicDefense: z.number().nonnegative("Magic defense must be a non-negative number").openapi({example: 5}),
    baseExperience: z.number().nonnegative("Base experience must be a non-negative number").openapi({example: 150}),
    jobExperience: z.number().nonnegative("Job experience must be a non-negative number").openapi({example: 40}),
});

export const MonstersSchema = z.array(MonsterSchema);