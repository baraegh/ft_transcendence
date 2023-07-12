import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsDate, IsBoolean, IsNumber } from "class-validator";

export class NOTIF_ACCEPT_DTO{

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    id: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    userID: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    friendID: number;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    blocked: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    isRequested: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    isFriend: boolean;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    requestAccepted: boolean;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    createdAt: Date;

    @ApiProperty()
    @IsDate()
    @IsNotEmpty()
    updatedAt: Date;
}