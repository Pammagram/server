import * as Joi from 'joi';

export const authValidationSchema = Joi.object({
  SESSION_TIMEOUT_IN_MS: Joi.number().required(),
  TWILIO_ACCOUNT_SERVICE_ID: Joi.string().required(),
  TWILIO_AUTH_TOKEN: Joi.string().required(),
  TWILIO_VERIFICATION_SERVICE_ID: Joi.string().required(),
});

export default () => ({
  sessionTimeoutInMs: Number(process.env.SESSION_TIMEOUT_IN_MS),
  twilioAccountServiceId: process.env.TWILIO_ACCOUNT_SERVICE_ID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioVerificationServiceId: process.env.TWILIO_VERIFICATION_SERVICE_ID,
});
