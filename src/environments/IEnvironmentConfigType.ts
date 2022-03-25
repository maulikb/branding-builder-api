export interface IEnvironmentConfigType {
  production: boolean;
  allowedOrigins: string[];
  fileUploadAllowedExtensions: string[];
  fileMaxSizeInBytes: number;
  cacheImageFolderPath: string;
  maxImageSize: number;
  minImageQualityLimit: number;
  standardImageQuality: number;
  standardImageBlurRatio: number;
}
