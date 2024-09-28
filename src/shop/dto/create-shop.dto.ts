import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";
import { PHONE_LOCATION } from "src/utils/constants";

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
    @IsPhoneNumber(PHONE_LOCATION)
    telephone: number;
}
