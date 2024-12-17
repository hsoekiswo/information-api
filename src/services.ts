import { Client } from 'pg';
import dotenv, { config }  from 'dotenv';

config();
export const apiKey = process.env.API_KEY;

dotenv.config({ path: '../.env' });
const client = new Client({
  user: process.env.POSTGRES_USER,
  host: 'postgres',
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

try {
    await client.connect();
    console.log('Connected to the database');
} catch (err) {
    console.error('Failed to connect to the database:', err.message);
    process.exit(1);
}

export default client;