import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CHATFRIENDDTO{

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    channelId:string;
}