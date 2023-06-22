import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString, isNumber } from 'class-validator';
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
  @IsOptional()
  otherUserId?: number;

  @ApiProperty({ nullable: true })
  @IsOptional()
  otherUserName?: string;
  @ApiProperty({ nullable: true })
  @IsOptional()
  otherUserImage?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  channelName?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  channelImage?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
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
  @IsOptional()
  channelName?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  channelImage?: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  lastMessage?: LastMessage;
}

export class PersonelChannelInfoDTO {
  @ApiProperty()
  channelId: string;

  @ApiProperty({ enum: ['PUBLIC', 'PRIVATE', 'PROTECTED', 'PERSONEL'] })
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
  @IsOptional()
  lastMessage?: LastMessage;
}

export class SHOWCHATDTO {
  @ApiProperty()
  @IsString()
  channelId: string;
}

export class ABOUTDTO {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsNumber()
  gameWon?: number;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsNumber()
  gameLost?: number;

  @ApiProperty({ nullable: true })
  @IsOptional()
  achievements?: string[];

  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}



export class data {
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  image: string;

  @ApiProperty()
  @IsNumber()
  id: number;
}

export class SHOW_MEMBERS_OFGROUP {
  @ApiProperty()
  owner: data;

  @ApiProperty()
  admins: data[];

  @ApiProperty()
  users:data[]
}

export class JOINGROUPDTO{
  @ApiProperty()
  @IsString()
  channelId: string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  password?:string
}

export class JOINGROUPRTURNDTO{
  @ApiProperty()
  @IsString()
  id:string;

  @ApiProperty({ enum: ['PUBLIC', 'PRIVATE', 'PROTECTED', 'PERSONEL'] })
  type: 'PUBLIC' | 'PERSONEL' | 'PRIVATE' | 'PROTECTED';

  @ApiProperty()
  @IsString()
  name:string;

  @ApiProperty({ nullable: true })
  @IsOptional()
  @IsString()
  image?:string;
}


export class INVETUSERDTO{
  @ApiProperty()
  @IsString()
  channelId: string;

  @ApiProperty()
  @IsNumber()
  otheruserid:number
}

