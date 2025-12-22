import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL ?? 'file:./dev.db',
  },
  migrations: {
    seed: 'bun prisma/seed.ts',
  },
  schema: 'prisma/schema.prisma',
});
