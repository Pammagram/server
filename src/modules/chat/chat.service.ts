import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ChatDto, CreateChatInput } from './dto';
import { ChatEntity, ChatType } from './entities';

import { UserService } from '../user/user.service';

@Injectable()
export class ChatService {
  constructor(
    @Inject('CHAT_REPOSITORY')
    private readonly chatsRepository: Repository<ChatEntity>,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<ChatDto[]> {
    return this.chatsRepository.find();
  }

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

    // TODO various error handling
    if (type === ChatType.PRIVATE && userIds.length > 1) {
      throw new NotAcceptableException(
        "Can't create private chat with more than one user",
      );
    }

    const users = await this.userService.findByUserIds(userIds);

    const chat = await this.chatsRepository.save({
      title,
      type,
      members: users,
    });

    return chat;
  }

  async removeById(chatId: number): Promise<boolean> {
    await this.chatsRepository.delete({
      id: chatId,
    });

    return true;
  }
}
