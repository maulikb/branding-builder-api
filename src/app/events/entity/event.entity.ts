import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Types, Schema as SchemaTypes, Document } from 'mongoose';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EventType } from '../@types/event-type';
import { QuoteCategories } from '../@types/quote-categories';
import { Transform } from 'class-transformer';
import moment from 'moment';
import logger from 'src/app/common/logger';
export type EventDocument = Event & Document;

const options = {
  autoCreate: true,
  collections: 'events',
  versionKey: false,
  timestamps: true,
};

/***
 * Define entity of events
 */

@Schema(options)
export class Event {
  @Prop({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toString().toLowerCase())
  @ApiProperty()
  name: string;

  @Prop({ required: true, type: String })
  @IsNotEmpty()
  @IsEnum(EventType)
  @ApiProperty()
  type: EventType;

  @Prop({ required: true })
  @IsNotEmpty()
  @Transform(({ value }) => value.toString().toLowerCase())
  @ApiProperty()
  description: string;

  @Prop({ type: [String], required: true })
  @IsNotEmpty()
  @ApiProperty()
  languages: string[];

  @Prop()
  @IsOptional()
  @IsEnum(QuoteCategories)
  @ApiProperty()
  categories?: QuoteCategories;

  @Prop({ type: Date })
  @IsOptional()
  @ApiProperty({ type: Date })
  @Transform(({ value }) => moment(value, moment.ISO_8601).toDate())
  startDate?: Date;

  @Prop({ type: Date })
  @IsOptional()
  @ApiProperty({ type: Date })
  // @Transform((value) => new Date(value.value))
  @Transform(({ value }) => moment(value, moment.ISO_8601).toDate())
  endDate?: Date;

  @Prop({ type: [SchemaTypes.Types.ObjectId], ref: 'EventPost' })
  @IsOptional()
  posts?: Types.ObjectId[];

  @Prop({ type: Object })
  @IsOptional()
  @ApiProperty()
  originLocation?: {
    country: string[];
    state: string[];
  };
}

export const EventSchema = SchemaFactory.createForClass(Event);
