import { UserEntity } from '@modules/user/entities';
import { User } from '@modules/user/types/user';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ChatEntity } from './chat.entity';

export type Message = {
  id: string;
  sender: User;
  text: string;
};

@Entity()
export class MessageEntity implements Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ChatEntity, {
    onDelete: 'CASCADE',
  })
  chat: ChatEntity;

  @Column('text')
  text: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  sender: UserEntity;
}
