import { appConfig, appValidationSchema } from './app';
import { authConfig, authValidationSchema } from './auth';
import { databaseValidationSchema, dbConfig } from './database';
import { securityConfig, securityValidationSchema } from './security';

export const configValidationSchema = appValidationSchema
  .and(authValidationSchema)
  .and(securityValidationSchema)
  .and(databaseValidationSchema);

export const config = () => ({
  app: appConfig(),
  auth: authConfig(),
  security: securityConfig(),
  database: dbConfig(),
});

export type Config = ReturnType<typeof config>;
