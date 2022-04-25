import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class LocationType {
  @IsArray()
  @Prop({ type: [String] })
  @ApiProperty({ type: [String] })
  country: string[];
  @IsArray()
  @Prop({ type: [String] })
  @ApiProperty({ type: [String] })
  state: string[];
  @IsArray()
  @Prop({ type: [String] })
  @ApiProperty({ type: [String] })
  city: string[];
}
