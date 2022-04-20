import { Injectable, Logger } from '@nestjs/common';
import Jimp from 'jimp';
import fs from 'fs';
import { environment } from 'src/environments';
import { CropType } from './@types/image-processing-types';
import { JIMP_MAX_FILE_SIZE_FOR_PROCESSING_IN_MB } from './constants';
import { FilePathService } from './file-path.service';
import { FileService } from './file.service';

const pathToSocialMediaIcon = '../../../public/social-media-icons';
@Injectable()
export class ImageProcessingService {
  private maxImageSize = environment.maxImageSize;
  private minImageQualityLimit = environment.minImageQualityLimit;

  constructor(
    private logger: Logger,
    private filePathService: FilePathService,
    private fileService: FileService,
  ) {}

  public async processImageAndCache(
    filePath: string,
    crop: CropType,
    quality: number,
  ) {
    let fileSizeInMegabytes = 0;
    try {
      const fsStat = fs.statSync(filePath);
      this.logger.debug(
        `ImageProcessingService.processImage() fsStat: ${JSON.stringify(
          fsStat,
        )}`,
      );
      fileSizeInMegabytes = fsStat.size / (1024 * 1024);
    } catch (err) {
      this.logger.error(
        `ImageProcessingService.processImage() error: ${JSON.stringify(err)}`,
      );
    }
    if (fileSizeInMegabytes > JIMP_MAX_FILE_SIZE_FOR_PROCESSING_IN_MB) {
      this.logger.error(
        `ImageProcessingService.processImage() fileSizeInMegabytes: ${fileSizeInMegabytes} is greater than ${JIMP_MAX_FILE_SIZE_FOR_PROCESSING_IN_MB}`,
      );
      return filePath;
    }
    const cachedFile = this.filePathService.getCacheImagePath(
      filePath,
      quality,
    );
    this.logger.debug(
      `ImageProcessingService.processImage() cacheFilePath: ${cachedFile}`,
    );

    if (fs.existsSync(cachedFile)) {
      return cachedFile;
    }

    if (quality < this.minImageQualityLimit) {
      quality = this.minImageQualityLimit;
    }
    try {
      if (!fs.existsSync(filePath)) {
        const error = new Error('File not found');
        throw error;
      }
      const image = await this.processImage(filePath, crop, quality);
      await image.writeAsync(cachedFile);
      return cachedFile;
    } catch (error) {
      this.logger.error(error);
      this.logger.debug(
        `ImageProcessingService.processImage() error: ${JSON.stringify(error)}`,
      );
    }
  }
  private async processImage(
    filePath: string,
    crop: CropType,
    quality: number,
    imageWidth?: number,
    imageHeight?: number,
  ) {
    const image = await Jimp.read(filePath);
    image.quality(quality);

    if (imageWidth === 0 || isNaN(imageWidth) || imageWidth === undefined) {
      imageWidth = image.getWidth();
    }

    if (imageHeight === 0 || isNaN(imageHeight) || imageHeight === undefined) {
      imageHeight = image.getHeight();
    }

    if (imageWidth > this.maxImageSize || imageHeight > this.maxImageSize) {
      if (imageWidth > imageHeight) {
        const ratio = imageHeight / imageWidth;
        imageWidth = this.maxImageSize;
        imageHeight = ratio * imageWidth;
      } else {
        const ratio = imageWidth / imageHeight;
        imageHeight = this.maxImageSize;
        imageWidth = ratio * imageHeight;
      }
    }
    if (crop === CropType.FIT) {
      await this.imageScaleToFit(image, imageWidth, imageHeight, filePath);
    } else if (crop === CropType.FILL) {
      this.imageScaleToFill(image, imageWidth, imageHeight);
    }
    return image;
  }

  private async imageScaleToFit(
    image: Jimp,
    w: number,
    h: number,
    sourceImagePath: string,
  ) {
    const sourceImage = await Jimp.read(sourceImagePath);
    image
      .cover(w, h)
      .composite(
        sourceImage.scaleToFit(w, h),
        (w - sourceImage.getWidth()) / 2,
        (h - sourceImage.getHeight()) / 2,
      );
    // if (blur) {
    //   await image.blur(blur === 0 ? standardImageBlurRatio : blur);

    // } else {
    //   image.contain(w, h).background(+background);
    // }
  }

  private imageScaleToFill(image: Jimp, w: number, h: number) {
    this.logger.debug(
      `ImageProcessingService.imageScaleToFill() is called with w: ${w}, h: ${h}, image: ${JSON.stringify(
        image,
      )}`,
    );
    image.cover(w, h);
  }

  // private async changeImageColor(imageName: string, color: string) {
  //   const image = await Jimp.read(`${pathToSocialMediaIcon}/${imageName}`);
  //   image.color([{ apply: 'red', params: [100] }]);
  //   return image;
  // }
}
