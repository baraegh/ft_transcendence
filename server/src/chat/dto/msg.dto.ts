import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, isNumber } from 'class-validator';
import { Transform as ClassTransform } from 'class-transformer';

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

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ enum: ['PUBLIC', 'PRIVATE', 'PROTECTED', 'PERSONEL'] })
  type: 'PUBLIC' | 'PERSONEL' | 'PRIVATE' | 'PROTECTED';

  @ApiProperty({ description: 'Channel id' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'IsOptional' })
  @IsOptional()
  @IsString()
  hash: string;



  @ApiProperty({ type: 'string', format: 'binary' ,description: 'IsOptional' })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: 'must be array of string of id' })
@IsArray()
@ArrayNotEmpty()
@Transform(({ value }) => JSON.parse(value).map((v: string) => Number(v)), { toClassOnly: true })
  members: number[];


  // parsedMembers(members: string[]): number[] {
  //   if (Array.isArray(members)) {
  //     return members.map((member) => Number(member));
  //   }
  //   return [];
  // }
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

  @ApiProperty() 
  @IsString()
  @IsNotEmpty()
  username: string;
}

