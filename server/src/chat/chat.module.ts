import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { FetchChatService } from './fetchChat.servise';

@Module({
  controllers: [ChatController],
  providers: [ChatService,FetchChatService]
})
export class ChatModule {}
