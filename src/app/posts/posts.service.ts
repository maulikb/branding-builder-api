import { HttpStatus, Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { EventPostDocument } from './entities/post.entity';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { EventPost } from './entities/post.entity';
import { EventsService } from '../events/events.service';
import { EventType } from '../events/@types/event-type';
import { CustomHTTPException } from '../common/errors/custom-http.exception';
import { CustomErrorCodes } from '../common/@types/custom-error-codes';
import { Types } from 'mongoose';
@Injectable()
export class PostsService {
  constructor(
    @InjectModel(EventPost.name) private postModel: Model<EventPostDocument>,
    private readonly configService: ConfigService,
    private eventService: EventsService,
  ) {}

  async createPost(createPostDto: CreatePostDto, eventName: string) {
    const eventPost = await this.postModel.create(createPostDto);
    const event = await this.eventService.findEventByName(eventName);
    if (event === null) {
      throw new CustomHTTPException(
        {
          key: 'error.CANNOT_FIND_EVENT',
        },
        HttpStatus.BAD_REQUEST,
        CustomErrorCodes.CANNOT_FIND_EVENT,
      );
    }
    if (event.type === EventType.TIME_CONSTRAINED_EVENT) {
      // const eventPostId = Types.ObjectId(eventPost._id);
      const tempPostsStore = event.posts;
      if (tempPostsStore.includes(eventPost._id)) {
        throw new CustomHTTPException(
          {
            key: 'error.POST_ALREADY_REGISTERED',
          },
          HttpStatus.BAD_REQUEST,
          CustomErrorCodes.POST_ALREADY_REGISTERED,
        );
      }
      tempPostsStore.push(eventPost._id);
      return this.eventService.updateEvent(event._id, {
        posts: tempPostsStore,
      });
      // return this.eventService.updateEvent();
    }
    // if{ event.type === EventType.TIME_CONSTRAINED_EVENT
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<EventPost> {
    const updatePost = await this.postModel.findByIdAndUpdate(
      id,
      { $set: updatePostDto },
      { new: true },
    );
    return updatePost;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
