import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { COLOR_VALIDATION_RULE } from 'src/app/common/constants';
import { PostAspectRatio } from '../@types/post-aspect-ratio';

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

  @Prop()
  @IsEnum(PostAspectRatio)
  @ApiProperty()
  postSize: PostAspectRatio;

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
