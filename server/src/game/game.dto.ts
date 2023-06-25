import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class CREAT_GAME_DTO{

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    userid:number
}

export class RETURN_OF_CREAT_GAME_DTO{
    @ApiProperty({description:'id of the game'})
    id: string;

    @ApiProperty({description:'userid ho create the invite or send request to play game'})
    user1Id: number;

    @ApiProperty({description:'other userid ho accept the invite '})
    user2Id: number;

    @ApiProperty({description:'if game not end it will be false'})
    game_end: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty({description:'point of user'})
    user1P: number;

    @ApiProperty({description:'point of other user'})
    user2P: number;
}