import { DataSource } from 'typeorm';

import { SessionEntity } from './session.entity';

export const authProviders = [
  {
    provide: 'SESSION_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(SessionEntity),
    inject: ['DATA_SOURCE'],
  },
];
