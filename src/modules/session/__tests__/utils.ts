import { repositoryMockFactory } from '@modules/common/__mocks__/utils';
import { Provider } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

import { SessionEntity } from '../entities';

export const SessionRepositoryProvider = getRepositoryToken(SessionEntity);

export const MockedSessionRepository: Provider = {
  provide: SessionRepositoryProvider,
  useFactory: repositoryMockFactory,
};
