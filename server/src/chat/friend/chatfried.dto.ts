import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CHATFRIENDDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  channelId: string;
}

export class BLOCK_FRIEND_DTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  FriendId: number;
}
