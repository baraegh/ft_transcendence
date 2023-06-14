import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsNumber, IsString, IsUrl } from "class-validator"

export class AuthDto_42 {
    @IsNotEmpty()
    @IsString()
    userName : string
    
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNumber()
    @IsNotEmpty()
    id: number

    @IsNotEmpty()
    @IsUrl()
    link: string

}
