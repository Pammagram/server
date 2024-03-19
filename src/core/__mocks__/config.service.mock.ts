import { CONFIG_PROVIDER, ConfigType } from '@config';
import { Provider } from '@nestjs/common';

export class MockedConfigServiceClass implements ConfigType {
  get app(): ConfigType['app'] {
    return { isDevelopment: false, isProduction: true, port: 1 };
  }

  get auth(): ConfigType['auth'] {
    return {
      saltRounds: 1,
      sessionTimeoutInMs: 1,
      twilioAccountServiceId: 'test twilioAccountServiceId',
      twilioAuthToken: 'test twilioAuthToken',
      twilioVerificationServiceId: 'test twilioVerificationServiceId',
    };
  }

  get database(): ConfigType['database'] {
    return {
      host: 'test localhost',
      name: 'test name',
      password: 'test password',
      port: 1,
      username: 'test username',
    };
  }

  get security(): ConfigType['security'] {
    return {
      cookieSecret: 'test cookie secret',
    };
  }
}

export const MockedConfigService: Provider = {
  provide: CONFIG_PROVIDER,
  useClass: MockedConfigServiceClass,
};
