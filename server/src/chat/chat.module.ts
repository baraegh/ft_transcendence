import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { FetchChatService } from './fetchChat.servise';
import { ChatOwnerService } from './owner/chatOwner.service';
import { ChaOwnertController } from './owner/chatOwner.controller';

@Module({
  controllers: [ChatController,ChaOwnertController],
  providers: [ChatService,FetchChatService,FetchChatService,ChatOwnerService]
})
export class ChatModule {}
