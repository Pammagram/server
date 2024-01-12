import { DataSource } from 'typeorm';

import { SessionEntity } from './session.entity';

export const sessionProviders = [
  {
    provide: 'SESSION_REPOSITORY', // TODO to constants
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SessionEntity),
    inject: ['DATA_SOURCE'],
  },
];

export * from './session.entity';
