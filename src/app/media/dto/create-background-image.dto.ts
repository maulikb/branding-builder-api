import { IsEnum, IsNotEmpty } from 'class-validator';
import { ImageTag } from '../@types/image-tags';

export class CreateBackgroundImageDto {
  @IsNotEmpty()
  readonly imageName: string;
  @IsNotEmpty()
  @IsEnum(ImageTag)
  readonly tags: ImageTag;
}
