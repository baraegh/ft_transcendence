import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class Edite_Profile_DTO {

    @ApiProperty({ type: 'string', format: 'binary' })
    image:  Express.Multer.File;
  
    @ApiProperty()
    @IsString()
    name: string;
}  

export class SELECTE_DATA_OF_OTHER_PLAYER{
    @ApiProperty({description:'id of other user'})
    id:number;

    @ApiProperty({description:'oher user image'})
    image:string;

    @ApiProperty({description:'oher user name'})
    username:string;
}

export class MATCH_HISTORY_DTO{

    @ApiProperty({description:'match id'})
    matchId:string

    @ApiProperty()
    otherUser:SELECTE_DATA_OF_OTHER_PLAYER;

    @ApiProperty({description:'if win is true'})
    @IsBoolean()
    win:boolean;
    @ApiProperty({description:'point of user'})
    user1P: number;

    @ApiProperty({description:'point of other user'})
    user2P: number;

}



// id:true,
// image:true,
// username:true,