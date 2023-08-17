import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString, isNumber } from "class-validator";

export class FRIEND_REQ{

    @ApiProperty({ description: 'friend id' })
    @IsNotEmpty()
    @IsNumber()
    receiverId : number
}

export class FRIEND_RES{

    @ApiProperty()
  channelID: string;

  @ApiProperty({ enum: ['PUBLIC', 'PRIVATE', 'PROTECTED', 'PERSONEL'] })
  type: 'PUBLIC' | 'PERSONEL' | 'PRIVATE' | 'PROTECTED';

  @ApiProperty()
  @IsBoolean()
  blocked: boolean;

  @ApiProperty()
  @IsNumber()
  hasblocked: number;

}