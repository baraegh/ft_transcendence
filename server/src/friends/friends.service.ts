import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendsService {
  constructor(private prisma: PrismaService) {}

  async sendFriendRequest(userid, friendId) {
    if (userid == friendId) throw new ForbiddenException('same person');
    let existingUser = await this.prisma.user.findUnique({
      where: { id: friendId },
    });
    if (!existingUser) {
      throw new ForbiddenException('The Friend Not Exist');
    }
    const chekiffriend = await this.prisma.friendship.findFirst({
      where: { userID: friendId, friendID: userid },
    });
    if (chekiffriend) {
      if (chekiffriend.isFriend == true)
        throw new ForbiddenException('friend request allredy accepted ');
      throw new ForbiddenException('request allredy send it ');
    }
    const friendshipRequest = await this.prisma.friendship.create({
      data: {
        userID: friendId,
        friendID: userid,
        isRequested: true,
        requestAccepted: false,
      },
    });
    return friendshipRequest;
  }
  async acceptFriendRequest(userid, friendId) {
    // Find the friendship request
    if (userid == friendId) throw new ForbiddenException('same person');
    let existingUser = await this.prisma.user.findUnique({
      where: { id: friendId },
    });
    if (!existingUser) {
      throw new ForbiddenException('The Friend Not Exist');
    }
    const friendshipRequest = await this.prisma.friendship.findFirst({
      where: {
        userID: userid ,
        friendID: friendId,
        isRequested: true,
        requestAccepted: false,
      },
    });
    if (!friendshipRequest) {
      throw new ForbiddenException('Friendship request not found.');
    }
    const acceptedFriendshipRequest = await this.prisma.friendship.update({
      where: { id: friendshipRequest.id },
      data: { requestAccepted: true, isFriend: true, isRequested: false },
    });
    await this.prisma.friendship.create({
      data: {
        userID: friendId,
        friendID: userid,
        isRequested: false,
        requestAccepted: true,
        isFriend: true,
      },
    });
    return acceptedFriendshipRequest;
  }
}
