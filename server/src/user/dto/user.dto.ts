import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class USERDTO {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  username: string;
  
  @ApiProperty()
  @IsNotEmpty()
  image: string;
}

export class USERINFODTO{
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  image: string;

  @IsNotEmpty()
  @ApiProperty()
  gameWon: number;

  @IsNotEmpty()
  @ApiProperty()
  gameLost: number;

  @IsNotEmpty()
  @ApiProperty()
  achievements: string[];
}


export class Friend{
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  username: string;

  @IsString()
  @ApiProperty()
  image: string;
}

export class USER_FRIEN_DTO{
  @ApiProperty()
  @IsBoolean()
  blocked: boolean;

  @IsBoolean()
  @ApiProperty()
  isRequested: boolean;

  @IsBoolean()
  @ApiProperty()
  isFriend: boolean;

  @IsBoolean()
  @ApiProperty()
  requestAccepted: boolean;
  @ApiProperty()
  friend: Friend;
    
}