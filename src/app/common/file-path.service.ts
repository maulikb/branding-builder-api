import { Injectable, Logger } from '@nestjs/common';
import path from 'path';
import { environment } from 'src/environments';
import { Md5 } from 'ts-md5';

@Injectable()
export class FilePathService {
  private cacheImageFolderPath = environment.cacheImageFolderPath;
  private publicFolderPath = path.join(__dirname, '../../../public');
  constructor(private logger: Logger) {}
  public getCacheImagePath(filePath: string, quality: number): string {
    this.logger.debug(
      `FilePathService.getCacheImagePath() is called with path: ${filePath} quality: ${quality}`,
    );
    const md5 = new Md5();
    md5.appendStr('image' + filePath + quality);
    const imageName = md5.end().toString() + '-cache';
    this.logger.debug(
      `FilePathService.getCacheImagePath() imageName: ${imageName}`,
    );
    const imageExtension = path.extname(filePath);
    this.logger.debug(
      `FilePathService.getCacheImagePath() imageExtension: ${imageExtension}`,
    );
    const imagePath = path.join(
      this.cacheImageFolderPath,
      imageName + imageExtension,
    );
    this.logger.debug(
      `FilePathService.getCacheImagePath() imagePath: ${imagePath}`,
    );
    return imagePath;
  }
}
