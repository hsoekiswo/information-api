import { z } from "@hono/zod-openapi";

export const JobLevelParamsSchema = z.object({
    type: z.enum(["job_first", "job_second", "job_third"]).openapi({example: "job_first"}),
    level: z.string().regex(/^\d+$/, "ID must be a numeric string").openapi({example: "30"}),
});