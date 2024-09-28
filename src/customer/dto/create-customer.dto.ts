import { IsEmail, IsMobilePhone, IsNotEmpty, IsString, Matches } from "class-validator";
import { MOBILE_LOCATION, PASSWORD_REG_EX, PASSWORD_UNMATCH_DES } from "src/utils/constants";

export class CreateCustomerDto {
    @IsNotEmpty()
    @IsString()
    fullname: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Matches(PASSWORD_REG_EX, { message: PASSWORD_UNMATCH_DES })
    password: string;

    @IsNotEmpty()
    @IsMobilePhone(MOBILE_LOCATION)
    telephone: number;
}
