import * as Joi from 'joi';

import { appConfig, appValidationSchema } from './app';
import { authConfig, authValidationSchema } from './auth';
import { databaseValidationSchema, dbConfig } from './database';
import { firebaseConfig, firebaseValidationSchema } from './firebase';
import { securityConfig, securityValidationSchema } from './security';

export const configValidationSchema = Joi.object()
  .concat(appValidationSchema)
  .concat(authValidationSchema)
  .concat(securityValidationSchema)
  .concat(databaseValidationSchema)
  .concat(firebaseValidationSchema);

export const config = () => ({
  app: appConfig(),
  auth: authConfig(),
  security: securityConfig(),
  database: dbConfig(),
  firebase: firebaseConfig(),
});

export type Config = ReturnType<typeof config>;
