import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// เอามาจากตัวแปร DATABASE_URL ที่ท่านตั้งใน docker-compose
const connectionString = process.env.DATABASE_URL!;

// ปิดการใช้งาน prefetch ให้ใช้งานผ่าน Bun ได้ดีขึ้น
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
