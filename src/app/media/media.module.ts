import { Module } from '@nestjs/common';
import { FileService } from '../common/file.service';
import { PostsModule } from '../posts/posts.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [PostsModule],
  providers: [MediaService, FileService],
  controllers: [MediaController],
})
export class MediaModule {}
