import { ChatType } from '../constants/chat-type';

export type Chat = {
  id: number;
  title: string;
  type: ChatType;
};
