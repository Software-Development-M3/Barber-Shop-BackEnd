import { IsNotEmpty, IsPhoneNumber, IsString, ValidateNested, IsArray, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { PHONE_LOCATION } from "src/utils/constants";
import { CreateBarberDto } from "./create-barber.dto";
import { CreateServiceDto } from "./create-service.dto";

export class UpdateShopDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsPhoneNumber(PHONE_LOCATION)
    telephone?: number;

    @IsOptional()
    @IsArray()
    tags?: [];

    @IsOptional()
    @IsString()
    timeOpen?: string;

    @IsOptional()
    @IsString()
    timeClose?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateBarberDto)
    barbers?: CreateBarberDto[];

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateServiceDto)
    services?: CreateServiceDto[];
}
