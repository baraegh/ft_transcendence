import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class OWNERDTO {
  @ApiProperty()
  @IsNumber()
  usertomute: number;

  @ApiProperty()
  @IsString()
  channelid: string;

  @ApiProperty({ enum: ['NAN', 'M15', 'M45', 'H8', 'FOREVER'] })
  @IsNotEmpty()
  mute: 'NAN' | 'M15' | 'M45' | 'H8' | 'FOREVER';
}

export class OWNERPROPDTO {
  @ApiProperty()
  @IsNumber()
  otheruser: number;

  @ApiProperty()
  @IsString()
  channelid: string;
}

export class CHANNELIDDTO {

    @ApiProperty()
    @IsString()
    channelid: string;
}

export class OWNEADDADMINRDTO {
  @ApiProperty({ description: 'must be array of string of id' })
@IsArray()
@ArrayNotEmpty()
@Transform(({ value }) => JSON.parse(value).map((v: string) => Number(v)), { toClassOnly: true })
  members: number[];
  
    @ApiProperty()
    @IsString()
    channelid: string;
  
    @ApiProperty({ enum: ['ADMIN', 'USER'] })
    @IsNotEmpty()
    role: 'ADMIN' | 'USER';
  }

  export class OWNEREDITDTO{

    @ApiProperty()
    @IsString()
    channelid: string;
    
    @ApiProperty({ enum :['PUBLIC'  ,'PRIVATE' , 'PROTECTED']})
    @IsNotEmpty()
    type: 'PUBLIC'  | 'PRIVATE' | 'PROTECTED';
  
    @ApiProperty({ description: 'Channel id' })
    @IsNotEmpty()
    @IsString()
    name: string;
  
    @ApiProperty({ description: 'IsOptional' })
    @IsOptional()
    @IsString()
    hash?: string;
  
    @ApiProperty({ description: 'IsOptional',type: 'string', format: 'binary'})
    @IsOptional()
    @IsString()
    image?: string;

  }
