import type { Config } from 'drizzle-kit';
export default {
  schema: './src/schema.ts',
  out: './src/drizzle',
  driver: 'better-sqlite'
} satisfies Config;
