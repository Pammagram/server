import { SessionEntity } from 'src/modules/session/entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, nullable: true })
  username: string | null;

  // TODO first name last name

  @Column('text')
  phoneNumber: string;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  lastActiveInMs: Date;

  @OneToMany(() => SessionEntity, (session) => session.user, {
    onDelete: 'CASCADE',
  })
  sessions: SessionEntity[];
}

export type User = UserEntity;
