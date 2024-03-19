import { PublicInterface } from '@core/types';
import { jest } from '@jest/globals';
import { Provider } from '@nestjs/common';

import { CookieService } from '../cookie.service';

export class MockedCookieServiceClass
  implements PublicInterface<CookieService>
{
  setCookie = jest.fn<CookieService['setCookie']>();
}

export const MockedCookieService: Provider = {
  provide: CookieService,
  useClass: MockedCookieServiceClass,
};
