import { PublicInterface } from '@core/types';
import { jest } from '@jest/globals';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export class MockedConfigServiceClass
  implements PublicInterface<ConfigService>
{
  get = jest.fn();

  getOrThrow = jest.fn();
}

export const MockedConfigService: Provider = {
  provide: ConfigService,
  useClass: MockedConfigServiceClass,
};
