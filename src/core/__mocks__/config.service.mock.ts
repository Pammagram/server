import { CONFIG_PROVIDER } from '@config';
import { PublicInterface } from '@core/types';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

class MockedConfigServiceClass implements PublicInterface<ConfigService> {
  get = jest.fn();

  getOrThrow = jest.fn();
}

export const MockedConfigService: Provider = {
  provide: CONFIG_PROVIDER,
  useClass: MockedConfigServiceClass,
};
