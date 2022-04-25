import { PartialType } from '@nestjs/mapped-types';
import {
  ApiProperty,
  OmitType,
  PartialType as PartialTypeSwagger,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { EventPost } from '../entities/post.entity';

export class CreatePostDto extends EventPost {}

export class CreatePostReqDto extends PartialType(
  OmitType(CreatePostDto, ['backgroundImage', 'foregroundImage']),
) {
  @IsNotEmpty()
  @ApiProperty()
  @Transform(({ value }) => value.toString().toLowerCase())
  eventName: string;
}
export class CreatePostReqSwaggerDto extends PartialTypeSwagger(
  OmitType(CreatePostDto, ['backgroundImage', 'foregroundImage']),
) {
  @IsNotEmpty()
  @ApiProperty()
  @Transform(({ value }) => value.toString().toLowerCase())
  eventName: string;
}

export class CreatePostResSwaggerDto extends CreatePostDto {}
