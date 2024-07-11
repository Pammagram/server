import { ChatEntity } from '@modules/chat/entities';
import { SessionEntity } from '@modules/session';

// TODO add first name last name
export type User = {
  chats: ChatEntity[];
  id: number;
  lastActiveInMs: Date;
  phoneNumber: string;
  sessions: SessionEntity[];
  username?: string;
};
