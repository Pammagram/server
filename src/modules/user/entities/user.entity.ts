import { ChatEntity } from '@modules/chat/entities';
import { SessionEntity } from '@modules/session/entities';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, nullable: true })
  username?: string;

  // TODO first name last name

  @Column('text', {
    unique: true,
  })
  phoneNumber: string;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastActiveInMs: Date;

  @OneToMany(() => SessionEntity, (session) => session.user, {
    cascade: true,
  })
  sessions: SessionEntity[];

  @ManyToMany(() => ChatEntity)
  chats: ChatEntity[];
}

export type User = UserEntity;
