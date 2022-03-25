import path from 'path';
import { IEnvironmentConfigType } from '../IEnvironmentConfigType';

export const environment: IEnvironmentConfigType = {
  production: false,
  allowedOrigins: ['http://localhost', 'https://localhost'],
  fileUploadAllowedExtensions: [
    '.jpg',
    '.jpeg',
    '.png',
    '.pdf',
    '.txt',
    '.doc',
    '.docx',
    '.rtf',
    '.bmp',
  ],
  fileMaxSizeInBytes: 24576000, // 24MB
  cacheImageFolderPath: path.join(__dirname, '../../../public/images/cache'),
  maxImageSize: 2500,
  maxImageSizeForWideScreen: '1920*1080',
  maxImageSizeForSquaredScreen: '1080*1080',
  minImageQualityLimit: 10,
  standardImageQuality: 60,
  standardImageBlurRatio: 15,
};
