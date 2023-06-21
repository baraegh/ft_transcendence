import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, isNumber } from 'class-validator';

enum Type {
  PRIVATE,
  PROTECTED,
  PUBLIC,
  PERSONEL
}
export class MSGDTO {
  
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  channelID: String;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: String;
}
export class CREATEGROUPSDTO {
  // @ApiProperty({ type:Type})
  @ApiProperty({ description: 'most be enum Type { PRIVATE,PROTECTED,PUBLIC,PERSONEL}' })
  @IsNotEmpty()
  @IsString()
  type: any;

  @ApiProperty({ description: 'Channel id' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'IsOptional' })
  @IsOptional()
  @IsString()
  hash: string;

  @ApiProperty({ description: 'IsOptional' })
  @IsOptional()
  @IsString()
  image: string;

  @ApiProperty({ description: 'must be array of sring of id' })
  @IsNotEmpty()
  @IsString()
  members: string;

   parsedMembers(members: string) : number[] {
    if (members.trim() !== '') {
      return members.split(',').map(Number);
    }
  }
}


export class FETCHMSG {
  @ApiProperty()
  @IsNumber()
  userId: number;
  
  @ApiProperty()
  @IsString()
  content: string;
  
  @ApiProperty()
  @IsDate()
  timeSend: Date;
  
  @ApiProperty({ required: false }) 
  @IsString()
  @IsOptional()
  image?: string;


}
