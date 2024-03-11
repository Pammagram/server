import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ChatEntity } from './chat.entity';

import { User, UserEntity } from '$modules/user/entities';

export type Message = {
  id: number;
  sender: User;
  text: string;
};

@Entity()
export class MessageEntity implements Message {
  @PrimaryGeneratedColumn()
  id: number;

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
