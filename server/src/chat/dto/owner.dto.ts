import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class OWNERDTO {
    @ApiProperty()
    @IsNumber()
    useruwannamute:number;

    @ApiProperty()
    @IsString()
    channelid:string;

    @ApiProperty({ enum: ['NAN', 'M15', 'M45', 'H8','FOREVER'] })
    @IsNotEmpty()
    mute: 'NAN' | 'M15' | 'M45'| 'H8'|'FOREVER';
}