import { PublicInterface } from '@core/types';
import { jest } from '@jest/globals';
import { Provider } from '@nestjs/common';

import { mockedSession } from './session.entity.mock';

import { SessionService } from '../service';

export class MockedSessionServiceClass
  implements PublicInterface<SessionService>
{
  findByUserId = jest.fn<SessionService['findByUserId']>();

  removeBySessionId = jest.fn<SessionService['removeBySessionId']>();

  removeById = jest.fn<SessionService['removeById']>();

  findBySessionId = jest.fn<SessionService['findBySessionId']>();

  findBySessionByIdOrFail = jest
    .fn<SessionService['findBySessionByIdOrFail']>()
    .mockImplementation((_data) => Promise.resolve(mockedSession));

  findSessionBySessionIdOrFailAndUpdate =
    jest.fn<SessionService['findSessionBySessionIdOrFailAndUpdate']>();

  updateBySessionId = jest.fn<SessionService['updateBySessionId']>();

  createSession = jest
    .fn<SessionService['createSession']>()
    .mockImplementation((_data) => Promise.resolve(mockedSession));

  findByIdOrFail = jest.fn<SessionService['findByIdOrFail']>();
}

export const MockedSessionService: Provider = {
  provide: SessionService,
  useClass: MockedSessionServiceClass,
};
