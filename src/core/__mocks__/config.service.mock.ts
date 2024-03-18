import { CONFIG_PROVIDER } from '@config';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// @ts-expect-error -- ts expects private fields to be defined
class MockedConfigServiceClass implements ConfigService {
  get = (_key) => '';

  getOrThrow = (_key) => '';
}

export const MockedConfigService: Provider = {
  provide: CONFIG_PROVIDER,
  useClass: MockedConfigServiceClass,
};
