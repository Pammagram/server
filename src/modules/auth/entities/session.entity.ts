import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type Session = {
  active: boolean;
  ip: string;
  lastVisitInMs: number;
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

  @Column('int')
  lastVisitInMs: number;

  @Column('boolean')
  active: boolean;

  @Column('text')
  sessionId: string;
}
