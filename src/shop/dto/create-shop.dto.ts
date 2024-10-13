import { IsNotEmpty, IsPhoneNumber, IsString, ValidateNested, IsArray } from "class-validator";
import { Type } from "class-transformer";
import { PHONE_LOCATION } from "src/utils/constants";
import { CreateBarberDto } from "./create-barber.dto";
import { CreateServiceDto } from './create-service.dto';

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

    @IsArray()
    tags: [];

    @IsString()
    timeOpen: string;

    @IsString()
    timeClose: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateBarberDto)
    barbers: CreateBarberDto[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateServiceDto)
    services: CreateServiceDto[];
}
