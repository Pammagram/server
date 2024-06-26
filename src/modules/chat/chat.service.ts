import { Injectable, Logger, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Maybe } from 'graphql/jsutils/Maybe';
import { In, Repository } from 'typeorm';

import { ChatDto, CreateChatInput, EditChatInput, MessageDto } from './dto';
import { ChatEntity, ChatType } from './entities';
import { MessageEntity } from './entities/message.entity';

import { UserService } from '../user/user.service';

@Injectable()
export class ChatService {
  private logger: Logger = new Logger(ChatService.name);

  constructor(
    @InjectRepository(ChatEntity)
    private chatsRepository: Repository<ChatEntity>,
    @InjectRepository(MessageEntity)
    private messagesRepository: Repository<MessageEntity>,
    private readonly userService: UserService,
  ) {}

  async findAll(): Promise<ChatDto[]> {
    return this.chatsRepository.find({
      relations: {
        members: true,
      },
    });
  }

  async findChatsByMemberId(memberId: number): Promise<ChatDto[]> {
    const memberChats = await this.chatsRepository.find({
      where: {
        members: {
          id: In([memberId]),
        },
      },
      relations: {
        members: true,
      },
    });

    return this.chatsRepository.find({
      where: {
        id: In(memberChats.map((chat) => chat.id)),
      },
      relations: {
        members: true,
      },
    });
  }

  async findById(chatId: number): Promise<ChatDto | null> {
    return this.chatsRepository.findOne({
      where: {
        id: chatId,
      },
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
    const { memberIds, title, type } = params;

    const matchUserCountInPrivateChat = 2;

    // TODO various error handling
    if (
      type === ChatType.PRIVATE &&
      memberIds.length > matchUserCountInPrivateChat
    ) {
      throw new NotAcceptableException(
        "Can't create private chat with more than two users",
      );
    }

    const users = await this.userService.findByUserIds(memberIds);

    const chat = await this.chatsRepository.save({
      title,
      type,
      members: users,
    });

    return chat;
  }

  async edit(params: EditChatInput): Promise<ChatDto> {
    const { chatId, title } = params;

    await this.chatsRepository.update(chatId, {
      title,
    });

    const updatedChat = await this.findByIdOrFail(chatId);

    return updatedChat;
  }

  async removeById(chatId: number): Promise<ChatDto> {
    const chat = await this.findByIdOrFail(chatId);

    await this.chatsRepository.delete({
      id: chatId,
    });

    return chat;
  }

  async addMembers(chatId: number, userIds: number[]): Promise<boolean> {
    const chat = await this.chatsRepository.findOneOrFail({
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

  async removeMember(chatId: number, memberId: number): Promise<boolean> {
    const chat = await this.chatsRepository.findOneOrFail({
      where: {
        id: chatId,
      },
      relations: {
        members: true,
      },
    });

    if (chat.type === ChatType.PRIVATE) {
      throw new NotAcceptableException("Can't remove member from private chat");
    }

    const updatedMembers = chat.members.filter(
      (member) => member.id !== memberId,
    );

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
    try {
      const data = await this.messagesRepository.insert({
        chat: {
          id: chatId,
        },
        sender: {
          id: senderId,
        },
        text,
      });

      const insertedId = data.identifiers[0]?.['id'] as number;

      const newMessage = await this.findMessageByIdOrFail(insertedId);

      return newMessage;
    } catch (error) {
      this.logger.error(error);

      throw error;
    }
  }

  /**
   * @deprecated use getMessagesByChatId instead
   */
  async messages(chatId: number): Promise<MessageDto[]> {
    return this.messagesRepository.find({
      where: {
        chat: {
          id: chatId,
        },
      },
      relations: {
        sender: true,
        chat: true,
      },
    });
  }

  async findMessagesByChatId(chatId: number): Promise<MessageDto[]> {
    return this.messagesRepository.find({
      where: {
        chat: {
          id: chatId,
        },
      },
      relations: {
        sender: true,
        chat: true,
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

  async findChatLastMessage(chatId: number): Promise<Maybe<MessageDto>> {
    return this.messagesRepository.findOne({
      where: { chat: { id: chatId } },
      relations: {
        sender: true,
      },
      order: {
        createdAt: {
          direction: 'desc',
        },
      },
    });
  }
}
