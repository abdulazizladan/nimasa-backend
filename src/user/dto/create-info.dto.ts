import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber } from "class-validator";

export class CreateInfoDto {

    @ApiProperty({})
    @IsString()
    firstName: string;

    @ApiProperty({})
    @IsString()
    lastName: string;

    @ApiProperty({})
    @IsNumber()
    age: number;

    @ApiProperty({})
    @IsString()
    image: string;
} 