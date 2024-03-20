import * as zod from 'zod';

export const databaseValidationSchema = zod.object({
  DATABASE_HOST: zod.string(),
  DATABASE_PORT: zod.number(),
  DATABASE_USERNAME: zod.string(),
  DATABASE_NAME: zod.string(),
  DATABASE_PASSWORD: zod.string(),
});

export const dbConfig = () => ({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  name: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
});
