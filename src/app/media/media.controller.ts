import { MediaService } from './media.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  LoggerService,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import path, { join } from 'path';
import multer from 'multer';
import { Response } from 'express';
import {
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CustomHTTPException } from '../common/errors/custom-http.exception';
import { ConfigService } from '@nestjs/config';
import { CustomErrorCodes } from '../common/@types/custom-error-codes';
import { environment } from 'src/environments/';
import { Observable, of } from 'rxjs';
import { ImageUploadType } from './@types/image-uploading-type';
import { TransformationInterceptor } from '../common/interceptors/transform.interceptor';

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
    private logger: Logger,
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
        imageUploadType: {
          type: 'string',
          enum: Object.values(ImageUploadType),
        },
        eventName: { type: 'string' },
      },
    },
  })
  @ApiTags('Media')
  @HttpCode(HttpStatus.OK)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('postId') postId: string,
    @Body('imageUploadType') imageUploadType: ImageUploadType,
    @Body('eventName') eventName: string,
  ) {
    return this.mediaService.uploadFile(
      file,
      postId,
      imageUploadType,
      eventName,
    );
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

  @Get('change-image-color/')
  @ApiTags('Media')
  @ApiQuery({
    name: 'IMAGE_NAME',
    required: true,
    type: String,
  })
  @ApiQuery({
    name: 'REPLACE_COLOR',
    required: true,
    type: String,
  })
  @ApiOperation({ summary: 'Get Image By Name' })
  // @ApiOkResponse({ content: { 'image/png': {} } })
  // @UseInterceptors(TransformationInterceptor)
  async changeIconColor(
    @Query('IMAGE_NAME') imageName: string,
    @Query('REPLACE_COLOR') replaceColor: string,
    @Res() res: Response,
    // eslint-disable-next-line @typescript-eslint/ban-types
  ): Promise<Object> {
    const updatedImagePath = await this.mediaService.changeImageColor(
      imageName,
      replaceColor,
    );
    this.logger.debug(updatedImagePath);

    // return of(res.sendFile(updatedImagePath));

    // return of(res.type('png').send(updatedImagePath));
    return of(res.sendFile(updatedImagePath));
    // return res.headers();
  }
}
