import { IsNotEmpty, IsString, IsInt, Min } from "class-validator";

export class CreateBarberDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsInt()
    @Min(0)
    experience: number; 

    @IsNotEmpty()
    @IsString()
    specialization: string;
}
