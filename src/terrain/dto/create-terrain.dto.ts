import { Type } from 'class-transformer';
import { IsDate, IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateTerrainDto {
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    date: Date;
  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsNumber()
  price: number;

  @IsString()
  longitude: string;

  @IsString()
  latitude: string;
}
