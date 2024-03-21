import * as Joi from 'joi';

export const securityValidationSchema = Joi.object({
  COOKIE_SECRET: Joi.string(),
});

export const securityConfig = () => ({
  cookieSecret: process.env.COOKIE_SECRET,
});
