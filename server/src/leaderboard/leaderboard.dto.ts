import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LEADERBOURD_DTO {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  rank: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  score: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  image: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  gameWon: number;
}
