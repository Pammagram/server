import { PublicInterface } from '@core/types';
import { jest } from '@jest/globals';
import { mockedUser } from '@modules/user/__mocks__/user.entity.mock';
import { Provider } from '@nestjs/common';

import { SessionEntity } from '../entities';
import { SessionService } from '../service';

export const mockedSession: SessionEntity = {
  device: 'test device',
  id: 1,
  ip: 'test ip',
  lastVisitInMs: new Date(),
  sessionId: 'test session id',
  user: mockedUser,
};

export class MockedSessionServiceClass
  implements PublicInterface<SessionService>
{
  findByUserId = jest.fn<SessionService['findByUserId']>();

  removeBySessionId = jest.fn<SessionService['removeBySessionId']>();

  removeById = jest.fn<SessionService['removeById']>();

  findBySessionId = jest.fn<SessionService['findBySessionId']>();

  findBySessionByIdOrFail =
    jest.fn<SessionService['findBySessionByIdOrFail']>();

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
