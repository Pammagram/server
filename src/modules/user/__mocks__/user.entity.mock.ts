import { User } from '@modules/user/entities';

export const mockedUser: User = {
  chats: [],
  id: 0,
  lastActiveInMs: new Date(),
  phoneNumber: '',
  sessions: [],
  username: 'test',
};
