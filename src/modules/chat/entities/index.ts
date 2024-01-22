import { DataSource } from 'typeorm';

import { ChatEntity } from './chat.entity';
import { MessageEntity } from './message.entity';

export const chatProviders = [
  {
    provide: 'CHAT_REPOSITORY', // TODO to constants
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(ChatEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'MESSAGE_REPOSITORY', // TODO to constants
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MessageEntity),
    inject: ['DATA_SOURCE'],
  },
];

export * from './chat.entity';
export * from './message.entity';
