import { Injectable, NotFoundException } from '@nestjs/common';
import { FILTER_USERS_DTO } from 'src/chat/friend/chatfried.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NOTIF_ACCEPT_DTO } from './notif.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}
  async Friends_Ho_Pending(userId: number): Promise<FILTER_USERS_DTO[]> {
    const finduser = await this.prisma.user.findFirst({
      where: { id: userId },
    });
    if (!finduser) {
      throw new NotFoundException('user not found');
    }

    const find_blocker = await this.prisma.friendship.findMany({
      where: {
        userID: userId,
        isRequested: true,
      },
      select: {
        friend: {
          select: {
            id: true,
            username: true,
            image: true,
          },
        },
      },
    });

    const blockedFriends: FILTER_USERS_DTO[] = find_blocker.map((blocker) => ({
      id: blocker.friend.id,
      username: blocker.friend.username,
      image: blocker.friend.image,
    }));

    return blockedFriends;
  }

  async acceptFriendRequest(userid, friendId):Promise<NOTIF_ACCEPT_DTO> {
    // Find the friendship request
    if (userid == friendId) return;
    let existingUser = await this.prisma.user.findUnique({
      where: { id: friendId },
    });
    if (!existingUser) {
     return;
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
      return;
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

  async deletfriendreq(userid, friendId){
    // Find the friendship request
    if (userid == friendId) return;
    let existingUser = await this.prisma.user.findUnique({
      where: { id: friendId },
    });
    if (!existingUser) {
     return;
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
      return;
    }
    await this.prisma.friendship.delete({
        where:{
            id:friendshipRequest.id,
        }
    })
  }
}
