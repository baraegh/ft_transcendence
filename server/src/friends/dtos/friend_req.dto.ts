import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, isNumber } from "class-validator";

export class FRIEND_REQ{

    @ApiProperty({ description: 'friend id' })
    @IsNotEmpty()
    @IsNumber()
    receiverId : number
}