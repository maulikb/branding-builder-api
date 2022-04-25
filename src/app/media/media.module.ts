import { Logger, Module } from '@nestjs/common';
import { FileService } from '../common/file.service';
import { UtilService } from '../common/util.service';
import { PostsModule } from '../posts/posts.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [PostsModule],
  providers: [MediaService, FileService, UtilService, Logger],
  controllers: [MediaController],
})
export class MediaModule {}
