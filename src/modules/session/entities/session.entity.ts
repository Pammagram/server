import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from '$modules/user/entities';

export type Session = {
  device: string;
  ip: string;
  lastVisitInMs: Date;
  sessionId: string;
};

@Entity()
export class SessionEntity implements Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  ip: string;

  @Column('text')
  device: string;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastVisitInMs: Date;

  @Column('text')
  sessionId: string;

  @ManyToOne(() => UserEntity, (user) => user.sessions, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
