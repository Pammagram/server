import * as Joi from 'joi';

export const authValidationSchema = Joi.object({
  SESSION_TIMEOUT_IN_MS: Joi.number().required(),
});

export default () => ({
  sessionTimeoutInMs: Number(process.env.SESSION_TIMEOUT_IN_MS),
});
