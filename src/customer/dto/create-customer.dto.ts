import { IsEmail, IsMobilePhone, IsNotEmpty, IsString, Matches } from "class-validator";

const passwordRegEx = /^[a-zA-Z0-9!@$%*?&]{2,20}$/;
// = /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;

export class CreateCustomerDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Matches(passwordRegEx, { message: 
        `Password must contain Minimum 2 and maximum 20 characters, contains any of uppercase or lowercase letter, number and special character`
        // `Password must contain Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter, one number and one special character` 
    })
    password: string;

    @IsNotEmpty()
    @IsMobilePhone("th-TH")
    telephone: number;
}
