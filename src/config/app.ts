import * as Joi from 'joi';

export enum NodeEnv {
  Production = 'production',
  Development = 'development',
}

export const appValidationSchema = Joi.object({
  PORT: Joi.number(),
});

export const appConfig = () => ({
  port: Number(process.env.PORT),
  isDevelopment: process.env.NODE_ENV === NodeEnv.Development,
  isProduction: process.env.NODE_ENV === NodeEnv.Production,
});
