import { jwt } from 'hono/jwt';
import jwtLib from 'jsonwebtoken';
import { MiddlewareHandler } from 'hono';

export const secret = process.env.JWT_SECRET;
const users = [
    { id: 1, username: 'admin', password: 'admin', role: 'admin' },
    { id: 2, username: 'ijun', password: 'ijun123', role: 'user' },
  ];

export async function loginUser(username: any, password: any) {
    const user = users.find((u) => u.username === username && u.password === password);

    if (!user) {
        return 'No Token';
    }
    
    const payload = { id: user.id, user: user.username, role: user.role };
    const token = jwtLib.sign(payload, secret, { expiresIn: '24h' });

    const decoded = jwtLib.decode(token);
    // Inspect the decoded payload
    console.log(decoded);

    return token;
};

export const loginMiddleware: MiddlewareHandler = jwt({ secret });

export const checkAdminRole: MiddlewareHandler = (c: any, next: () => Promise<void>) => {
    const user = c.get('jwtPayload');
    if (user.role !== 'admin') {
        return c.json({ message: 'Forbidden: Admins only' }, 403);
    }
    return next();
};