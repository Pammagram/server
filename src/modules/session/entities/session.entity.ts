import { UserEntity } from 'src/modules/user/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export type Session = {
  active: boolean;
  ip: string;
  lastVisitInMs: Date;
  sessionId: string;
  userAgent: string;
};

@Entity()
export class SessionEntity implements Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  ip: string;

  @Column('text')
  userAgent: string;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastVisitInMs: Date;

  @Column('boolean')
  active: boolean;

  @Column('text')
  sessionId: string;

  @ManyToOne(() => UserEntity, (user) => user.sessions)
  user: UserEntity;
}
