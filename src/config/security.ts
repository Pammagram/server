import * as zod from 'zod';

export const securityValidationSchema = zod.object({
  COOKIE_SECRET: zod.string(),
});

export const securityConfig = () => ({
  cookieSecret: process.env.COOKIE_SECRET,
});
