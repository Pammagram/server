import * as Joi from 'joi';

export const firebaseValidationSchema = Joi.object({
  FIREBASE_PROJECT_ID: Joi.string(),
  FIREBASE_PRIVATE_KEY: Joi.string(),
  FIREBASE_CLIENT_EMAIL: Joi.string(),
});

export const firebaseConfig = () => ({
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: String(process.env.FIREBASE_PRIVATE_KEY).replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
});
