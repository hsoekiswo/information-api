import { loginUser } from "./service";

export async function loginHandler(c: any) {
    const { username, password } = await c.req.json();
    const result = await loginUser(username, password);

    if (result) {
        return c.json({
            status: "success",
            message: `Login success, welcome ${username}`,
            data: result,
        }, 201);
    } else {
        return c.json({
            status: "failed",
            message: `Invalid username or password`,
            data: result,
        }, 400);
    }
}