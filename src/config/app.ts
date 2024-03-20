import * as zod from 'zod';

export const appValidationSchema = zod.object({
  PORT: zod.number(),
});

export const appConfig = () => ({
  port: Number(process.env.PORT),
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
});
