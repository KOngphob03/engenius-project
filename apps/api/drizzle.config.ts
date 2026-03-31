import type { Config } from 'drizzle-kit';

export default {
  schema: './src/infrastructure/database/drizzle/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
