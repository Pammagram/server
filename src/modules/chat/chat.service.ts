import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ChatDto, CreateChatInput } from './dto';
import { ChatEntity } from './entities';

import { UserService } from '../user/user.service';

@Injectable()
export class ChatService {
  constructor(
    @Inject('CHAT_REPOSITORY')
    private readonly chatsRepository: Repository<ChatEntity>,
    private readonly userService: UserService,
  ) {}

  async findByIdOrFail(chatId: number): Promise<ChatDto> {
    return this.chatsRepository.findOneOrFail({
      where: {
        id: chatId,
      },
      relations: {
        members: true,
      },
    });
  }

  async create(params: CreateChatInput): Promise<ChatDto> {
    const { userIds, title, type } = params;

    const users = await this.userService.findByUserIds(userIds);

    const chat = await this.chatsRepository.save({
      title,
      type,
      members: users,
    });

    return chat;
  }
}
