import { z } from "zod";

export const monsterIdSchema = z.number().min(1001, "Minimum Monster ID is 1001").max(1602, "Maximum Monster ID is 1602")

export const MonsterSchema = z.object({
    monsterId: monsterIdSchema,
    name: z.string().min(1, "Monster name cannot be empty"),
    level: z.number().min(0).max(150, "Level must be between 0 and 150"),
    hp: z.number().nonnegative("HP must be a non-negative number"),
    attackMin: z.number().nonnegative("Minimum attack must be a non-negative number"),
    attackMax: z.number().nonnegative("Maximum attack must be a non-negative number"),
    defense: z.number().nonnegative("Defense must be a non-negative number"),
    magicDefense: z.number().nonnegative("Magic defense must be a non-negative number"),
    baseExperience: z.number().nonnegative("Base experience must be a non-negative number"),
    jobExperience: z.number().nonnegative("Job experience must be a non-negative number"),
})