import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatService } from './chat.service';
import { ChatEntity, MessageEntity } from './entities';
import { ChatFieldsResolver } from './resolvers/chat-fields';
import { ChatResolver } from './resolvers/chats';
import { MessageResolver } from './resolvers/messages';

import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChatEntity, MessageEntity]), UserModule],
  providers: [ChatResolver, MessageResolver, ChatFieldsResolver, ChatService],
})
export class ChatModule {}
