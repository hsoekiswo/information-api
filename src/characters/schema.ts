import { z } from '@hono/zod-openapi'

// export const MonsterIdSchema = z.number().min(1001, "Minimum Monster ID is 1001").max(1602, "Maximum Monster ID is 1602").openapi({example: 1002});

// const MonsterIdParams = z.string().regex(/^\d+$/, "ID must be a numeric string").openapi({example: "1002"});

// export const MonsterIdParamsSchema =  z.object({
//     id: MonsterIdParams
// });

export const CharacterFormSchema = z.object({
    id: z.string().transform((val) => Number(val)),
    name: z.string(),
    level: z.string().transform((val) => Number(val)),
});