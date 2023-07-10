import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { FetchChatService } from './fetchChat.servise';
import { ChatOwnerService } from './owner/chatOwner.service';
import { ChaOwnertController } from './owner/chatOwner.controller';
import { ChaFriendController } from './friend/chatFriend.controller';
import { ChatFriendService } from './friend/chatFriend.service';
import { FriendsService } from 'src/friends/friends.service';

@Module({
  controllers: [ChatController, ChaOwnertController, ChaFriendController],
  providers: [
    ChatService,
    FetchChatService,
    FetchChatService,
    ChatOwnerService,
    ChatFriendService,
    FriendsService
  ],
})
export class ChatModule {}
