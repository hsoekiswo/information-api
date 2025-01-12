import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { loginMiddleware } from "../auth/service";
import { CharacterFormSchema } from "./schema";
import { postCharacterHandler } from "./controller";
import { object } from "zod";

export const app = new OpenAPIHono();

app.use('*', loginMiddleware);

const postCharacter = createRoute({
    method: "post",
    path: "/",
    tags: ["Characters"],
    request: {
        body: {
            content: {
                'application/x-www-form-urlencoded': {
                    schema: CharacterFormSchema,
                },
            },
        },
    },
    responses: {
        201: {
            content: {
                'application/json': {
                    schema: CharacterFormSchema,
                },
            },
            description: "Post single character to the database"
        },
    },
});

app.openapi(postCharacter, postCharacterHandler);