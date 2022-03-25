import { applyDecorators, SetMetadata } from '@nestjs/common';
import { SocialMeDiaAccountTypes } from '../@types/social-media-accounts-types';
import { SOCIAL_ID_KEY } from '../constants';
import { IsValidSocialID } from './is-valid-social-id';

export function SocialIdVerifier(...socialIds: string[]) {
  return applyDecorators(
    SetMetadata(SOCIAL_ID_KEY, socialIds),
    // IsValidSocialID(SOCIAL_ID_KEY),
  );
}
