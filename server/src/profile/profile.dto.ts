import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class Edite_Profile_DTO {

    @ApiProperty({ type: 'string', format: 'binary' })
    image:  Express.Multer.File;
  
    @ApiProperty()
    @IsString()
    name: string;
}  