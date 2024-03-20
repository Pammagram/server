import * as zod from 'zod';

export const authValidationSchema = zod.object({
  SESSION_TIMEOUT_IN_MS: zod.number(),
  TWILIO_ACCOUNT_SERVICE_ID: zod.string(),
  TWILIO_AUTH_TOKEN: zod.string(),
  TWILIO_VERIFICATION_SERVICE_ID: zod.string(),
  SALT_ROUNDS: zod.number(),
});

export const authConfig = () => ({
  sessionTimeoutInMs: Number(process.env.SESSION_TIMEOUT_IN_MS),
  twilioAccountServiceId: process.env.TWILIO_ACCOUNT_SERVICE_ID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioVerificationServiceId: process.env.TWILIO_VERIFICATION_SERVICE_ID,
  saltRounds: Number(process.env.SALT_ROUNDS),
});
