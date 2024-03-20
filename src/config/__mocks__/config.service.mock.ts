import { Config } from '@config';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class MockedConfigServiceClass implements Config {
  get app(): Config['app'] {
    return { isDevelopment: false, isProduction: true, port: 1 };
  }

  get auth(): Config['auth'] {
    return {
      saltRounds: 1,
      sessionTimeoutInMs: 1,
      twilioAccountServiceId: 'test twilioAccountServiceId',
      twilioAuthToken: 'test twilioAuthToken',
      twilioVerificationServiceId: 'test twilioVerificationServiceId',
    };
  }

  get database(): Config['database'] {
    return {
      host: 'test localhost',
      name: 'test name',
      password: 'test password',
      port: 1,
      username: 'test username',
    };
  }

  get security(): Config['security'] {
    return {
      cookieSecret: 'test cookie secret',
    };
  }
}

export const MockedConfigService: Provider = {
  provide: ConfigService,
  useClass: MockedConfigServiceClass,
};
