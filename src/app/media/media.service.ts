import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { CustomErrorCodes } from '../common/@types/custom-error-codes';
import { CustomHTTPException } from '../common/errors/custom-http.exception';
import { FileService } from '../common/file.service';
import { PostsService } from '../posts/posts.service';
const publicFolderPath = '../../../public';

@Injectable()
export class MediaService {
  constructor(
    private postService: PostsService,
    private configService: ConfigService,
    private fileService: FileService,
  ) {}
  public async uploadFile(file: Express.Multer.File, postId: string) {
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
    const pathToPublicTemp = path.join(
      __dirname,
      `${publicFolderPath}/media/c`,
    );
    await this.fileService.moveFileToDirectory(file.path, pathToPublicTemp);
    const pathToFileFromMedia = `background-images/${file.filename}`;
    const post = await this.postService.updatePost(postId, {
      backgroundImage: pathToFileFromMedia,
    });
    return post;
  }
  // public async changeImageColor(imageName: string, color: string) {}
  public async getFileByName(fileName: string) {
    const pathToFile = path.join(
      __dirname,
      `${publicFolderPath}/temp` + fileName,
    );
    return pathToFile;
  }
}
