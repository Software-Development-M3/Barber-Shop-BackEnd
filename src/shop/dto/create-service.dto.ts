import { IsNotEmpty, IsString, IsInt, IsNumber } from 'class-validator';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @IsNotEmpty()
  @IsInt()
  price: number;

  @IsNotEmpty()
  @IsInt()
  serviceTypeId: number;
}
