import { MediaService } from './media.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import path, { join } from 'path';
import multer from 'multer';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomHTTPException } from '../common/errors/custom-http.exception';
import { ConfigService } from '@nestjs/config';
import { CustomErrorCodes } from '../common/@types/custom-error-codes';
import { environment } from 'src/environments/';
import { Observable, of } from 'rxjs';

const multerTemp = '../../../multer-store';

const storageOption = multer.diskStorage({
  destination: path.join(__dirname, multerTemp),
  filename: (req, file, cb) => {
    const spitName = file.originalname.split('.');
    const extention = spitName[spitName.length - 1];
    const fileName = spitName.slice(0, spitName.length - 1).join('.');
    cb(null, `${fileName} - ${Date.now()}.${extention}`);
  },
});

const imageFiter = (req, file, cb) => {
  const allowedExt = environment.fileUploadAllowedExtensions;
  const ext = path.extname(file.originalname);
  if (allowedExt.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new CustomHTTPException(
        {
          key: 'errors.INVALID_FILE_TYPE',
        },
        HttpStatus.BAD_REQUEST,
        CustomErrorCodes.INVALID_FILE_TYPE,
      ),
      false,
    );
  }
};

@Controller({ path: 'api/', version: '1' })
export class MediaController {
  private postAllowedExtentions: string;
  constructor(
    private mediaService: MediaService,
    private configService: ConfigService,
  ) {}
  /***
   * Handler to upload single image
   */
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storageOption,
      fileFilter: imageFiter,
    }),
  )
  @Post('upload-image')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload Single Image And Update Post' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        postId: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiTags('Media')
  @HttpCode(HttpStatus.OK)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('postId') postId: string,
  ) {
    return this.mediaService.uploadFile(file, postId);
  }

  // /***
  //  * Handler to upload multiple image
  //  */
  // @UseInterceptors(
  //   FilesInterceptor('files', UPLOADING_FILE_LIMIT, {
  //     storage: storageOption,
  //     fileFilter: imageFiter,
  //   }),
  // )
  // @Post('images')
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       files: {
  //         type: 'array',
  //         items: {
  //           type: 'string',
  //           format: 'binary',
  //         },
  //       },
  //     },
  //   },
  // })
  // @ApiTags('Media')
  // @HttpCode(HttpStatus.OK)
  // async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
  //   files.forEach((file) => {
  //     this.mediaService.uploadFile(file);
  //   });
  // }

  /***
   * Function to get image by name
   */
  @Get('get-image/:IMAGE_NAME')
  @ApiTags('Media')
  @ApiOperation({ summary: 'Get Image By Name' })
  findImage(
    @Param('IMAGE_NAME') imagename: string,
    @Res() res,
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): Observable<Object> {
    return of(res.sendFile(join(process.cwd(), 'public/temp/' + imagename)));
  }

  @Get('get-image/:IMAGE_NAME')
  @ApiTags('Media')
  @ApiOperation({ summary: 'Get Image By Name' })
  changeIconColor(iconName: string, color: string) {
    // return of(res.sendFile(join(process.cwd(), 'public/temp/' + imagename)));
  }
}
