import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import replaceColor from 'replace-color';
import path, { join } from 'path';
import { CustomErrorCodes } from '../common/@types/custom-error-codes';
import { CustomHTTPException } from '../common/errors/custom-http.exception';
import { FileService } from '../common/file.service';
import { PostsService } from '../posts/posts.service';
import Jimp from 'jimp';
import { ImageUploadType } from './@types/image-uploading-type';
import { UtilService } from '../common/util.service';
const absolutePublicFolderPath = path.join(__dirname, '../../../public');
const publicFolderPath = '../../../public';

const pathToSocialIconFolder = 'public/media/social_media_icons/';

@Injectable()
export class MediaService {
  constructor(
    private postService: PostsService,
    private configService: ConfigService,
    private fileService: FileService,
    private utilService: UtilService,
  ) {}
  public async uploadFile(
    file: Express.Multer.File,
    postId: string,
    imageUploadType: ImageUploadType,
    eventName: string,
  ) {
    const fileSizeLimit = this.configService.get('fileSizeMaxIn Bytes');
    if (file.size > fileSizeLimit) {
      await this.fileService.deleteFile(file.path);
      throw new CustomHTTPException(
        {
          key: 'errors.FILE_SIZE_IS_TOO_BIG',
        },
        HttpStatus.BAD_REQUEST,
        CustomErrorCodes.FILE_SIZE_IS_TOO_BIG,
      );
    }

    const pathToPublicMedia = path.join(
      __dirname,
      `${publicFolderPath}/media/${imageUploadType.toLowerCase()}/${eventName}`,
    );

    await this.fileService.moveFileToDirectory(file.path, pathToPublicMedia);
    const pathToFileFromMedia = `${imageUploadType.toLowerCase()}/${eventName}/${
      file.filename
    }`;

    if (imageUploadType === ImageUploadType.BACKGROUND_IMAGE) {
      const post = await this.postService.updatePost(postId, {
        backgroundImage: pathToFileFromMedia,
      });
      return post;
    }
    if (imageUploadType === ImageUploadType.FOREGROUND_IMAGE) {
      const post = await this.postService.updatePost(postId, {
        foregroundImage: pathToFileFromMedia,
      });
      return post;
    }
  }
  public async changeImageColor(imageName: string, replaceColor: string) {
    const imageFilePath = join(
      process.cwd(),
      pathToSocialIconFolder + imageName,
    );
    const outputImagePath = join(
      absolutePublicFolderPath,
      'media/tmp/' + imageName,
    );

    const image = await Jimp.read(imageFilePath);
    const rgba = this.utilService.hexToRgbA(replaceColor.trim());
    // let bufferString: Buffer;

    //save changed image to temp
    image
      .color([
        { apply: 'red', params: [rgba.red] },
        { apply: 'green', params: [rgba.green] },
        { apply: 'blue', params: [rgba.blue] },
      ])
      .writeAsync(outputImagePath);

    return outputImagePath;

    //generating chaged image buffer string
    // const bufferString = await image
    //   .color([
    //     { apply: 'red', params: [rgba.red] },
    //     { apply: 'green', params: [rgba.green] },
    //     { apply: 'blue', params: [rgba.blue] },
    //   ])
    //   .getBufferAsync(Jimp.MIME_PNG)
    //   .then((buffer) => {
    //     return buffer;
    //   });
    // return bufferString;
  }
  public async getFileByName(fileName: string) {
    const pathToFile = path.join(
      __dirname,
      `${publicFolderPath}/temp` + fileName,
    );
    return pathToFile;
  }
}
