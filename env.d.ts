declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Base
      NODE_ENV: 'production' | 'development';

      // App
      PORT: string;

      // Auth
      SESSION_TIMEOUT_IN_MS: number;

      // Others
      COOKIE_SECRET: string;

      // Database
      DATABASE_HOST: string;
      DATABASE_PORT: number;
      DATABASE_USERNAME: string;
      DATABASE_PASSWORD: string;
      DATABASE_NAME: string;
    }
  }
}

export {};
