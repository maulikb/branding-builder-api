import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EventsService } from 'src/app/events/events.service';
import { OnEvent } from '@nestjs/event-emitter';
import { PostEventType } from '../@types/posts-event-type';
import { Types } from 'mongoose';
import { CustomHTTPException } from 'src/app/common/errors/custom-http.exception';
import { CustomErrorCodes } from 'src/app/common/@types/custom-error-codes';
import { UtilService } from 'src/app/common/util.service';

@Injectable()
export class PostListener {
  constructor(
    private logger: Logger,
    private eventService: EventsService,
    private utilService: UtilService,
  ) {}
  @OnEvent(PostEventType.DELETE_POST)
  public async deleteRefOfPost(postID: Types.ObjectId) {
    const foundEventsWithPosts = await this.eventService.findEventsByPostId(
      postID,
    );
    if (foundEventsWithPosts === null) {
      throw new CustomHTTPException(
        {
          key: 'error.CANNOT_FIND_POST',
        },
        HttpStatus.BAD_REQUEST,
        CustomErrorCodes.CANNOT_FIND_POST,
      );
    }
    foundEventsWithPosts.forEach(async (event) => {
      const tempPostStore: Types.ObjectId[] =
        this.utilService.removeElementFromArray(event.posts, postID);
      await this.eventService.commonEventUpdate(event._id, {
        posts: tempPostStore,
      });
      this.logger.debug(
        `PostListener.deleteRefOfPost() postID:${postID} is removed from eventID: ${event._idD}`,
      );
    });
  }
}
