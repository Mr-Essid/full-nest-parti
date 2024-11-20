import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from '@nestjs/class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @Length(8)
  phone?: string;
}
