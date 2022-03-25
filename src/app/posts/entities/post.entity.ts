import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { COLOR_VALIDATION_RULE } from 'src/app/common/constants';
import { PostSize } from '../@types/post-size';

export type EventPostDocument = EventPost & Document;
const options = {
  autoCreate: true,
  collections: 'posts',
  versionKey: false,
  timestamps: true,
};

/***
 * Define entity of posts
 */

@Schema(options)
export class EventPost {
  @Prop({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @Matches(COLOR_VALIDATION_RULE)
  @ApiProperty()
  primaryColor: string;

  @Prop({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @Matches(COLOR_VALIDATION_RULE)
  @ApiProperty()
  secondaryColor: string;

  @Prop({ type: String, nullable: true, default: '' })
  @ApiProperty()
  backgroundImage?: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @ApiProperty()
  supportedLanguages: string[];

  @Prop({ type: PostSize })
  @ValidateNested()
  @ApiProperty()
  @Type(() => PostSize)
  postSize: PostSize;

  @Prop({ type: Object })
  @IsOptional()
  @ApiProperty()
  celebrationLocation?: {
    conuntry: string[];
    state: string[];
    city: string[];
  };
}

export const EventPostSchema = SchemaFactory.createForClass(EventPost);
