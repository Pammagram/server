import { User } from '@modules/user/types/user';

export type Session = {
  device: string;
  id: number;
  ip: string;
  lastVisitInMs: Date;
  sessionId: string;
  user: User;
  messagingToken?: string;
};
