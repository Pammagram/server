import * as Joi from 'joi';

export const securityValidationSchema = Joi.object({
  COOKIE_SECRET: Joi.string().required(),
});

export default () => ({
  cookieSecret: process.env.COOKIE_SECRET,
});
