import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { ExperiencesSchema } from './schema';
import { postExperiencesHandler } from './controller';

export const app = new OpenAPIHono();

const postExperiences = createRoute({
    method: "post",
    path: "/auto",
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: ExperiencesSchema
                },
            },
            description: "Post multiple experience by selected job type (Novice, First, Second)"
        },
    },
});

app.openapi(postExperiences, postExperiencesHandler);

export default app;
  