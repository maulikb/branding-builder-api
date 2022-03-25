import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  ValidateNested,
} from 'class-validator';
import { SocialMediaLinks } from './schemas/social-media-links';
import mongoose from 'mongoose';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export type BusinessDocument = Business & mongoose.Document;

const options = {
  autoCreate: true,
  collections: 'events',
  versionKey: false,
  timestamps: true,
};
@Schema(options)
export class Business {
  @Prop({ required: true })
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @Prop({ required: true })
  @IsNotEmpty()
  @Matches('^[s()+-]*([0-9][s()+-]*){12}$')
  @ApiProperty()
  contactNumber: string;

  @Prop({ type: SocialMediaLinks })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SocialMediaLinks)
  @ApiProperty()
  socialMediaLinks?: SocialMediaLinks;

  @Prop()
  @IsEmail()
  @IsOptional()
  @ApiProperty()
  email?: string;

  @Prop()
  @IsUrl()
  @IsOptional()
  @ApiProperty()
  website?: string;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
