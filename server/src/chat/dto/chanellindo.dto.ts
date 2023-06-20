import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
export class LastMessage {
  @ApiProperty()
  messageId: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  timeSent: Date;

  @ApiProperty()
  senderId: number;
}
export class ChannelInfoDTO {
  @ApiProperty()
  channelId: string;

  @ApiProperty({ enum: ['PRIVATE', 'PROTECTED', 'PUBLIC', 'PERSONEL'] })
  type: 'PUBLIC' | 'PERSONEL' | 'PRIVATE' | 'PROTECTED';

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  otherUserId?: number;

  @ApiProperty({ nullable: true })
  otherUserName?: string;
  @ApiProperty({ nullable: true })
  otherUserImage?: string;

  @ApiProperty({ nullable: true })
  channelName?: string;

  @ApiProperty({ nullable: true })
  channelImage?: string;

  @ApiProperty({ nullable: true })
  lastMessage?: LastMessage;
}

export class ChannelGroupInfoDTO {
  @ApiProperty()
  channelId: string;

  @ApiProperty({ enum: ['PRIVATE', 'PROTECTED', 'PUBLIC'] })
  type: 'PUBLIC' | 'PRIVATE' | 'PROTECTED' | 'PERSONEL';

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  channelName?: string;

  @ApiProperty({ nullable: true })
  channelImage?: string;

  @ApiProperty({ nullable: true })
  lastMessage?: LastMessage;
}

export class PersonelChannelInfoDTO {
  @ApiProperty()
  channelId: string;

  @ApiProperty({ type: 'string', example: 'PERSONEL' })
  type: 'PUBLIC' | 'PERSONEL' | 'PRIVATE' | 'PROTECTED';

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  otherUserId: number;

  @ApiProperty()
  otherUserName: string;

  @ApiProperty()
  otherUserImage: string;

  @ApiProperty({ nullable: true })
  lastMessage?: LastMessage;
}

export class SHOWCHATDTO {
  @ApiProperty()
  @IsString()
  channelId: string;

  @ApiProperty({ nullable: true })
  @IsString()
  password?: string;
}
export class ABOUTREQUESTDTO {
  @ApiProperty()
  @IsNumber()
  friendId: number;
}
export class ABOUTDTO {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty({ nullable: true })
  @IsNumber()
  gameWon?: number;

  @ApiProperty({ nullable: true })
  @IsNumber()
  gameLost?: number;

  @ApiProperty({ nullable: true })
  achievements?: string[];

  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}
