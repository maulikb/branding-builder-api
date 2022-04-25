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
import { LocationType } from 'src/app/common/@types/location.type';
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
  @ApiProperty({ type: String })
  primaryColor: string;

  @Prop({ required: true, type: String })
  @IsNotEmpty()
  @IsString()
  @Matches(COLOR_VALIDATION_RULE)
  @ApiProperty({ type: String })
  secondaryColor: string;

  @Prop({ type: String, nullable: true, default: '' })
  @ApiProperty({ type: String })
  backgroundImage?: string;

  @Prop({ type: String, nullable: true, default: '' })
  @ApiProperty({ type: String })
  foregroundImage?: string;

  @Prop({ type: Boolean })
  @ApiProperty({ type: Boolean })
  visibility?: boolean;

  @Prop({ required: true })
  @IsNotEmpty()
  @ApiProperty({ type: [String] })
  supportedLanguages: string[];

  @Prop({ type: PostSize })
  @ValidateNested()
  @ApiProperty({ type: PostSize })
  @Type(() => PostSize)
  postSize: PostSize;

  @Prop({ type: LocationType })
  @IsOptional()
  @ApiProperty({ type: LocationType })
  celebrationLocation?: LocationType;
}

export const EventPostSchema = SchemaFactory.createForClass(EventPost);
