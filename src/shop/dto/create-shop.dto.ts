import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class CreateShopDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    location: string;

    @IsNotEmpty()
    @IsPhoneNumber("TH")
    telephone: number;
}
