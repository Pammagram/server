import { UserEntity } from '@modules/user/entities';
import { registerEnumType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ChatType } from '../constants/chat-type';
import { Chat } from '../types/chat';

registerEnumType(ChatType, {
  name: 'ChatType',
});

@Entity()
export class ChatEntity implements Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  type: ChatType;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  members: UserEntity[];
}
