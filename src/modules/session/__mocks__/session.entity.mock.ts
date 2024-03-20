import { mockedUser } from '@modules/user/__mocks__/user.entity.mock';

import { SessionEntity } from '../entities';

export const mockedSession: SessionEntity = {
  device: 'test device',
  id: 1,
  ip: 'test ip',
  lastVisitInMs: new Date(),
  sessionId: 'test session id',
  user: mockedUser,
};
