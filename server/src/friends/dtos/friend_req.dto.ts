import { IsNotEmpty, IsNumber, isNumber } from "class-validator";

export class FRIEND_REQ{
    @IsNotEmpty()
    @IsNumber()
    receiverId : number
}