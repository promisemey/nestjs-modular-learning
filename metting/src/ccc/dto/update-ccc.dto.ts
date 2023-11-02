import { PartialType } from '@nestjs/swagger';
import { CreateCccDto } from './create-ccc.dto';

export class UpdateCccDto extends PartialType(CreateCccDto) {}
