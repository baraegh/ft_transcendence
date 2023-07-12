import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, isNumber } from "class-validator";

export class FRIEND_REQ{

    @ApiProperty({ description: 'friend id' })
    @IsNotEmpty()
    @IsNumber()
    receiverId : number
}

export class FRIEND_RES{

    @ApiProperty({ description: 'channel id' })
    @IsNotEmpty()
    @IsString()
    channelID : string
}