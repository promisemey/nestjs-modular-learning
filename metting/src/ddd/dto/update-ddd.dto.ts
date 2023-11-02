import { PartialType } from '@nestjs/swagger';
import { CreateDddDto } from './create-ddd.dto';

export class UpdateDddDto extends PartialType(CreateDddDto) {}
