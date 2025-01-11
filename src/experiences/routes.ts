import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { ExperiencesSchema } from './schema';
import { postExperiencesHandler } from './controller';
import { loginMiddleware, checkAdminRole } from "../auth/service";

export const app = new OpenAPIHono();

app.use('*', loginMiddleware);
app.use('*', checkAdminRole);

const postExperiences = createRoute({
    method: "post",
    path: "/auto",
    tags: ["Other"],
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
  