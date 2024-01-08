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
    }
  }
}

export {};
