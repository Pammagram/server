import { User, UserEntity } from 'src/modules/user/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ChatEntity } from './chat.entity';

export type Message = {
  id: number;
  sender: User;
  text: string;
};

@Entity()
export class MessageEntity implements Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatEntity)
  chat: ChatEntity;

  @Column('text')
  text: string;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
  })
  sender: UserEntity;
}
