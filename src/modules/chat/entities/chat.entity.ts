import { registerEnumType } from '@nestjs/graphql';
import { UserEntity } from 'src/modules/user/entities';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ChatType {
  PRIVATE = 'private',
  GROUP = 'group',
}

registerEnumType(ChatType, {
  name: 'ChatType',
});

export type Chat = {
  id: number;
  title: string;
  type: ChatType;
};

@Entity()
export class ChatEntity implements Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  title: string;

  @Column('text')
  type: ChatType;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  members: UserEntity[];
}
