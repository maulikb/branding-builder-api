import { Logger } from '@nestjs/common';
import Jimp from 'jimp/*';
import { environment } from 'src/environments';
import { CropType } from './@types/image-processing-types';

export class ImageProcessingService {
  private maxImageSize = environment.maxImageSize;

  constructor(private logger: Logger) {}
  private async processImage(
    filePath: string,
    imageWidth: number,
    imageHeight: number,
    crop: CropType,
    quality: number,
  ) {
    const image = await Jimp.read(filePath);
    image.quality(quality);
    if (imageWidth === 0 || isNaN(imageWidth)) {
      imageWidth = image.getWidth();
    }

    if (imageHeight === 0 || isNaN(imageHeight)) {
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
}
