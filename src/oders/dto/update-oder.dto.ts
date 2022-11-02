import { PartialType } from '@nestjs/swagger';
import { CreateOderDto } from './create-oder.dto';

export class UpdateOderDto extends PartialType(CreateOderDto) {}
