import * as Joi from 'joi';

export const authValidationSchema = Joi.object({
  SESSION_TIMEOUT_IN_MS: Joi.number(),
  TWILIO_ACCOUNT_SERVICE_ID: Joi.string(),
  TWILIO_AUTH_TOKEN: Joi.string(),
  TWILIO_VERIFICATION_SERVICE_ID: Joi.string(),
  SALT_ROUNDS: Joi.number(),
});

export const authConfig = () => ({
  sessionTimeoutInMs: Number(process.env.SESSION_TIMEOUT_IN_MS),
  twilioAccountServiceId: process.env.TWILIO_ACCOUNT_SERVICE_ID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioVerificationServiceId: process.env.TWILIO_VERIFICATION_SERVICE_ID,
  saltRounds: Number(process.env.SALT_ROUNDS),
});
