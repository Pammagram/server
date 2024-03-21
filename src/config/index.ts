import * as Joi from 'joi';

import { appConfig, appValidationSchema } from './app';
import { authConfig, authValidationSchema } from './auth';
import { databaseValidationSchema, dbConfig } from './database';
import { securityConfig, securityValidationSchema } from './security';

export const configValidationSchema = Joi.object()
  .concat(appValidationSchema)
  .concat(authValidationSchema)
  .concat(securityValidationSchema)
  .concat(databaseValidationSchema);

export const config = () => ({
  app: appConfig(),
  auth: authConfig(),
  security: securityConfig(),
  database: dbConfig(),
});

export type Config = ReturnType<typeof config>;
