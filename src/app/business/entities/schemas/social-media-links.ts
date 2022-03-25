import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SocialMeDiaAccountTypes } from 'src/app/common/@types/social-media-accounts-types';
import { IsValidSocialID } from 'src/app/common/decorators/is-valid-social-id';

export class SocialMediaLinks {
  @IsString()
  @IsOptional()
  @IsValidSocialID(SocialMeDiaAccountTypes.FACEBOOK)
  @ApiProperty()
  facebook?: string;
  @IsString()
  @IsOptional()
  @IsValidSocialID(SocialMeDiaAccountTypes.INSTAGRAM)
  @ApiProperty()
  instagram?: string;
  @IsString()
  @IsOptional()
  @IsValidSocialID(SocialMeDiaAccountTypes.TWITTER)
  @ApiProperty()
  twitter?: string;
  @IsString()
  @IsOptional()
  @IsValidSocialID(SocialMeDiaAccountTypes.YOUTUBE)
  @ApiProperty()
  youtube?: string;
}
