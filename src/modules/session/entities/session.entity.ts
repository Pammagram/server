import { UserEntity } from '@modules/user/entities';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SessionEntity {
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
