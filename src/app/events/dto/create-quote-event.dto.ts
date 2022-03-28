import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import {
  PartialType as PartialTypeSwagger,
  OmitType as OmitTypeSwagger,
} from '@nestjs/swagger';
import { Event } from '../entity/event.entity';
export class CreateQuoteEventDto extends PartialType(
  OmitType(Event, ['startDate', 'endDate']),
) {}

export class CreateQuoteEventReqSwaggerDto extends PartialTypeSwagger(
  OmitTypeSwagger(Event, ['startDate', 'endDate', 'posts']),
) {}

export class CreateQuoteEventResSwaggerDto extends PartialTypeSwagger(
  OmitTypeSwagger(Event, ['startDate', 'endDate']),
) {}
