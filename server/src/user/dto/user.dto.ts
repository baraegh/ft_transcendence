import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

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