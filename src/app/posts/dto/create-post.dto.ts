import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { EventPost } from '../entities/post.entity';

export class CreatePostDto extends EventPost {}

export class CreatePostReqSwaggerDto extends PartialType(
  OmitType(CreatePostDto, ['backgroundImage']),
) {
  @IsNotEmpty()
  @ApiProperty()
  eventName: string;
}

export class CreatePostResSwaggerDto extends CreatePostDto {}
