import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class _2FA_DTO{

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    secret:string;
}