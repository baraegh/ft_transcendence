import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async sendFriendRequest(senderId, receiverId) {
    if (senderId == receiverId) throw new ForbiddenException('same person');
    const existingUser = await this.prisma.user.findUnique({
      where: { id: receiverId },
    });
    if (!existingUser) {
      throw new ForbiddenException('The Friend Not Exist');
    }
    const friendshipRequest = await this.prisma.friendship.create({
      data: {
        userID: senderId,
        friendID: receiverId,
        isRequested: true,
        requestAccepted: false,
      },
    });
    return friendshipRequest;
  }
  async acceptFriendRequest(senderId, receiverId) {
    // Find the friendship request
    if (senderId == receiverId) throw new ForbiddenException('same person');
    const friendshipRequest = await this.prisma.friendship.findFirst({
      where: {
        userID: receiverId,
        friendID: senderId,
        isRequested: true,
        requestAccepted: false,
      },
    });
    if (!friendshipRequest) {
      throw new Error('Friendship request not found.');
    }
    const acceptedFriendshipRequest = await this.prisma.friendship.update({
      where: { id: friendshipRequest.id },
      data: { requestAccepted: true, isFriend: true, isRequested: false },
    });
    await this.prisma.friendship.create({
      data: {
        userID: senderId,
        friendID: receiverId,
        isRequested: false,
        requestAccepted: true,
        isFriend: true,
      },
    });
    return acceptedFriendshipRequest;
  }
}