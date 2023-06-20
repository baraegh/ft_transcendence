import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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

export class OWNERREMOVEDTO {
  @ApiProperty()
  @IsNumber()
  usertoremove: number;

  @ApiProperty()
  @IsString()
  channelid: string;
}

export class OWNERCLEARCHATDTO {

    @ApiProperty()
    @IsString()
    channelid: string;
}
