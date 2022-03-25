import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventPost, EventPostSchema } from './entities/post.entity';
import { FileService } from '../common/file.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    EventsModule,
    MongooseModule.forFeatureAsync([
      {
        name: EventPost.name,
        useFactory: () => {
          const schema = EventPostSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, FileService],
  exports: [PostsService],
})
export class PostsModule {}
