import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UpdatePostDto } from './dto/update-post.dto';
import { EventPostDocument } from './entities/post.entity';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { EventPost } from './entities/post.entity';
import { EventsService } from '../events/events.service';
import { EventType } from '../events/@types/event-type';
import { CustomHTTPException } from '../common/errors/custom-http.exception';
import { CustomErrorCodes } from '../common/@types/custom-error-codes';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PostEventType } from './@types/posts-event-type';
import { CreatePostReqDto } from './dto/create-post.dto';
@Injectable()
export class PostsService {
  constructor(
    @InjectModel(EventPost.name) private postModel: Model<EventPostDocument>,
    private readonly configService: ConfigService,
    private eventEmitter: EventEmitter2,
    private eventService: EventsService,
  ) {}
  /***
   * Function to create post and add reference in event
   */
  async createPost(createPostReqDto: CreatePostReqDto, eventName: string) {
    const eventPost = await this.postModel.create(createPostReqDto);
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

  /***
   * Function to get all posts
   */
  findAllPosts() {
    return this.postModel.find().exec();
  }

  /***
   * Function to get post by id
   */
  findPostByID(id: string) {
    return this.postModel.findById(id);
  }

  /***
   * Function to update post
   */
  async updatePost(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<EventPost> {
    const updatePost = await this.postModel.findByIdAndUpdate(
      id,
      { $set: updatePostDto },
      { new: true },
    );
    return updatePost;
  }

  /***
   * Function to delete post by id
   */
  async deletePost(id: string) {
    this.eventEmitter.emit(PostEventType.DELETE_POST);
    this.postModel.remove(id);
  }
}
