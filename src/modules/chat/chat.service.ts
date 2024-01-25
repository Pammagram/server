import { Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ChatDto, CreateChatInput, MessageDto } from './dto';
import { ChatEntity, ChatType } from './entities';
import { MessageEntity } from './entities/message.entity';

import { UserService } from '../user/user.service';

@Injectable()
export class ChatService {
  constructor(
    @Inject('CHAT_REPOSITORY')
    private readonly chatsRepository: Repository<ChatEntity>,
    @Inject('MESSAGE_REPOSITORY')
    private readonly messagesRepository: Repository<MessageEntity>,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<ChatDto[]> {
    return this.chatsRepository.find({
      relations: {
        members: true,
      },
    });
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

    const matchUserCountInPrivateChat = 2;

    // TODO various error handling
    if (
      type === ChatType.PRIVATE &&
      userIds.length > matchUserCountInPrivateChat
    ) {
      throw new NotAcceptableException(
        "Can't create private chat with more than two users",
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

  async addMembers(chatId: number, userIds: number[]): Promise<boolean> {
    const chat = await this.chatsRepository.findOne({
      where: {
        id: chatId,
      },
      relations: {
        members: true,
      },
    });

    if (chat.type === ChatType.PRIVATE) {
      throw new NotAcceptableException("Can't add members to private chat");
    }

    const newMembers = await this.userService.findByUserIds(userIds);

    const updatedMembers = [...chat.members, ...newMembers];

    await this.chatsRepository.update(chatId, {
      id: chatId,
      members: updatedMembers,
    });

    return true;
  }

  async addMessage(
    senderId: number,
    chatId: number,
    text: string,
  ): Promise<MessageDto> {
    const data = await this.messagesRepository.insert({
      chat: {
        id: chatId,
      },
      sender: {
        id: senderId,
      },
      text,
    });

    const insertedId = data.identifiers[0].id as number;

    const newMessage = await this.findMessageByIdOrFail(insertedId);

    return newMessage;
  }

  async messages(chatId: number): Promise<MessageDto[]> {
    return this.messagesRepository.find({
      where: {
        chat: {
          id: chatId,
        },
      },
      relations: {
        sender: true,
      },
    });
  }

  async findMessageByIdOrFail(messageId: number): Promise<MessageDto> {
    return this.messagesRepository.findOneOrFail({
      where: { id: messageId },
      relations: {
        chat: {
          members: true,
        },
        sender: true,
      },
    });
  }
}
