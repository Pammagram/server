import { SessionEntity } from 'src/modules/auth/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  username: string;

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
}

export type User = Omit<UserEntity, 'sessions'>;
