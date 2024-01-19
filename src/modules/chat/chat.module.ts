import { Module } from '@nestjs/common';

import { ChatResolver } from './chat.resolver';
import { ChatService } from './chat.service';
import { chatProviders } from './entities';

import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [...chatProviders, ChatService, ChatResolver],
})
export class ChatModule {}
