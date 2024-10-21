import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

class HairCutDto {
  @IsNotEmpty()
  @IsInt()
  serviceId: number;

  @IsNotEmpty()
  @IsString()
  style: string;
  
  @IsNotEmpty()
  @IsString()
  hairLength: string;

  @IsOptional()
  @IsString()
  additionalRequirement?: string;
}

class HairWashDto {
  @IsNotEmpty()
  @IsInt()
  serviceId: number;

  // @IsNotEmpty()
  // @IsString()
  // shampooType: string;

  @IsNotEmpty()  
  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  additionalRequirement?: string;
}

class HairDyeDto {
  @IsNotEmpty()    
  @IsInt()
  serviceId: number;

  @IsNotEmpty() 
  @IsString()
  color: string;

  // @IsNotEmpty() 
  // @IsString()
  // brand: string;

  @IsOptional()
  @IsString()
  additionalRequirement?: string;
}

class ServicesDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => HairCutDto)
  hairCut?: HairCutDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HairWashDto)
  hairWash?: HairWashDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => HairDyeDto)
  hairDye?: HairDyeDto;
}

export class CreateBookingDto {
  @IsNotEmpty() 
  @IsString()
  shopId: string;

  @IsNotEmpty() 
  @ValidateNested()
  @Type(() => ServicesDto)
  services: ServicesDto;

  @IsNotEmpty() 
  @IsString()
  barberId: string;

  @IsNotEmpty() 
  @IsInt()
  price: number;

  @IsNotEmpty() 
  @IsInt()
  timeTotal: number;

  @IsNotEmpty() 
  @Matches(/^\d{2}-\d{2}-\d{4}T\d{2}:\d{2}$/)
  date: string;

  @IsNotEmpty()
  @Matches(/^\d{2}-\d{2}-\d{4}T\d{2}:\d{2}$/)
  startTime: string;

  @IsNotEmpty()
  @Matches(/^\d{2}-\d{2}-\d{4}T\d{2}:\d{2}$/)
  endTime: string;
}
