import * as Joi from 'joi';

export const databaseValidationSchema = Joi.object({
  DATABASE_HOST: Joi.string(),
  DATABASE_PORT: Joi.number(),
  DATABASE_USERNAME: Joi.string(),
  DATABASE_NAME: Joi.string(),
  DATABASE_PASSWORD: Joi.string(),
});

export const dbConfig = () => ({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  name: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
});
