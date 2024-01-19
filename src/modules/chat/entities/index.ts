import { DataSource } from 'typeorm';

import { ChatEntity } from './chat.entity';

export const chatProviders = [
  {
    provide: 'CHAT_REPOSITORY', // TODO to constants
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ChatEntity),
    inject: ['DATA_SOURCE'],
  },
];

export * from './chat.entity';
