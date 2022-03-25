import { registerDecorator, ValidationOptions } from 'class-validator';
import { SocialLinks } from 'social-links';
import { SocialMeDiaAccountTypes } from '../@types/social-media-accounts-types';

export function IsValidSocialID(
  accountType: SocialMeDiaAccountTypes,
  validationOptions?: ValidationOptions,
) {
  const socialLinks = new SocialLinks();
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isValidSocialID',
      target: object.constructor,
      propertyName: propertyName,
      constraints: ['isValidSocialID'],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value === 'string') {
            console.log(socialLinks.isValid('facebook', value));
            return socialLinks.isValid(accountType, value);
          } else {
            return true;
          }
        },
        defaultMessage: () => ` Your ${accountType} ID is not valid`,
      },
    });
  };
}
