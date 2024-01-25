import { Module } from '@nestjs/common';

import { ChatService } from './chat.service';
import { chatProviders } from './entities';
import { ChatResolver } from './resolvers/chats';
import { MessageResolver } from './resolvers/messages';

import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [...chatProviders, ChatService, ChatResolver, MessageResolver],
})
export class ChatModule {}
