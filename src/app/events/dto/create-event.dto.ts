import { OmitType, PartialType } from '@nestjs/mapped-types';
import {
  PartialType as PartialTypeSwagger,
  OmitType as OmitTypeSwagger,
} from '@nestjs/swagger';
import { Event } from '../entity/event.entity';
export class CreateEventDto extends PartialType(
  OmitType(Event, ['categories']),
) {}

export class CreateEventReqSwagger extends PartialTypeSwagger(
  OmitTypeSwagger(Event, ['categories', 'posts']),
) {}

export class CreateEventResSwagger extends PartialTypeSwagger(
  OmitTypeSwagger(Event, ['categories']),
) {}
