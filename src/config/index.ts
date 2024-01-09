import { ConfigType as NestJsConfigType, registerAs } from '@nestjs/config';
import * as Joi from 'joi';

import app, { appValidationSchema } from './app';
import auth, { authValidationSchema } from './auth';
import database, { databaseValidationSchema } from './database';
import security, { securityValidationSchema } from './security';

export const configValidationSchema = Joi.object()
  .concat(appValidationSchema)
  .concat(authValidationSchema)
  .concat(securityValidationSchema)
  .concat(databaseValidationSchema);

const getConfig = () => ({
  app: app(),
  auth: auth(),
  security: security(),
  database: database(),
});

const registerConfig = registerAs('config', getConfig);

export type ConfigType = NestJsConfigType<typeof registerConfig>;

export const CONFIG_PROVIDER = registerConfig.KEY;

export default registerConfig;
