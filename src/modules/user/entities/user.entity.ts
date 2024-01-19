import { ChatEntity } from 'src/modules/chat/entities';
import { SessionEntity } from 'src/modules/session/entities';
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

  @Column('text')
  phoneNumber: string;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastActiveInMs: Date;

  @OneToMany(() => SessionEntity, (session) => session.user, {
    onDelete: 'CASCADE',
  })
  sessions: SessionEntity[];

  @ManyToMany(() => ChatEntity)
  chats: ChatEntity[];
}

export type User = UserEntity;
