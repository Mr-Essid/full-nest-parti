import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchPlayerDto } from './create-match-player.dto';

export class UpdateMatchPlayerDto extends PartialType(CreateMatchPlayerDto) {}
