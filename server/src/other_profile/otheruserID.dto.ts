import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class Friend{
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
  }
  

export class ABOUOTHERTDTO {

    @ApiProperty()
    @IsNumber()
    id: number;

    @ApiProperty()
    @IsString()
    username: string;
  
    @ApiProperty()
    @IsString()
    image: string;
    @ApiProperty({ nullable: true })
    @IsOptional()
    @IsNumber()
    gameWon?: number;
  
    @ApiProperty({ nullable: true })
    @IsOptional()
    @IsNumber()
    gameLost?: number;
  
    @ApiProperty( )
    achievements: string[];
  
    @ApiProperty()
    @IsDate()
    updatedAt: Date;

    @ApiProperty()
    @IsBoolean()
    blocked: boolean;

    @ApiProperty()
    @IsNumber()
    hosblocked:number;
  
    @IsBoolean()
    @ApiProperty()
    isRequested: boolean;
  
    @IsBoolean()
    @ApiProperty()
    isFriend: boolean;
  
    @IsBoolean()
    @ApiProperty()
    requestAccepted: boolean;
  }