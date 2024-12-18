import { z } from "zod";

export const MonsterSchema = z.object({
    monsterId: z.number().min(1001).max(1602),
    name: z.string(),
    level: z.number().min(0).max(150),
    hp: z.number().positive(),
    attackMin: z.number().nonnegative(),
    attackMax: z.number().nonnegative(),
    defense: z.number().nonnegative(),
    magicDefense: z.number().nonnegative(),
    baseExperience: z.number().nonnegative(),
    jobExperience: z.number().nonnegative(),
})