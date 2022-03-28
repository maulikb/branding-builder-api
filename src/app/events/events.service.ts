import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Model } from 'mongoose';
import { Event, EventDocument } from './entity/event.entity';
import { EventType } from './@types/event-type';
import { CreateQuoteEventDto } from './dto/create-quote-event.dto';
import { QuoteCategories } from './@types/quote-categories';
import { UpdateQuoteEventDto } from './dto/update-quote.dto';
import { Types } from 'mongoose';
import { CommonUpdateEventDto } from './dto/common-even-update.dto';
import { LocationFilterType } from './@types/location-filter-type';

@Injectable()
export class EventsService {
  private logger = new Logger(EventsService.name);
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  /***
   * Function to register new festival
   */
  async createEvent(CreateEventDto: CreateEventDto): Promise<Event> {
    const event = await this.eventModel.findOne({
      name: CreateEventDto.name,
    });
    if (event) {
      throw new HttpException('Event Already Exist', HttpStatus.BAD_REQUEST);
    }
    return this.eventModel.create(CreateEventDto);
  }

  /***
   * Function to register new quote
   */
  async createQuote(createQuoteEventDto: CreateQuoteEventDto): Promise<Event> {
    const event = await this.eventModel.findOne({
      name: createQuoteEventDto.name,
    });
    if (event) {
      throw new HttpException('Event Already Exist', HttpStatus.BAD_REQUEST);
    }
    return this.eventModel.create(createQuoteEventDto);
  }

  /***
   * Function to get all events
   */
  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  /***
   * Function to find event by name
   */
  async findEventByName(eventName: string) {
    return this.eventModel.findOne({ name: eventName }).exec();
  }

  /***
   * Function to get today events
   */
  async findUpcomingEvents(
    locationFilterType: LocationFilterType,
    locationFilterValue?: string,
  ): Promise<Event[]> {
    switch (locationFilterType) {
      case LocationFilterType.GLOBAL:
        return this.eventModel.aggregate([
          {
            $match: { type: EventType.TIME_CONSTRAINED_EVENT },
          },
          {
            $match: {
              $and: [
                { startDate: { $gt: new Date() } },
                { endDate: { $gt: new Date() } },
              ],
            },
          },
        ]);
      case LocationFilterType.COUNTRY_AND_STATE:
        const countryAndState = locationFilterValue.split('_');
        const country = countryAndState[0];
        const state = countryAndState[1];
        return this.eventModel.aggregate([
          {
            $match: { type: EventType.TIME_CONSTRAINED_EVENT },
          },
          {
            $match: {
              $and: [
                { startDate: { $gt: new Date() } },
                { endDate: { $gt: new Date() } },
              ],
            },
          },
          {
            $match: {
              $and: [
                { 'originLocation.country': country },
                { 'originLocation.state': state },
              ],
            },
          },
        ]);
      case LocationFilterType.COUNTRY:
        return this.eventModel.aggregate([
          {
            $match: { type: EventType.TIME_CONSTRAINED_EVENT },
          },
          {
            $match: {
              $and: [
                { startDate: { $gt: new Date() } },
                { endDate: { $gt: new Date() } },
              ],
            },
          },
          {
            $match: {
              'originLocation.country': locationFilterValue,
            },
          },
        ]);
      case LocationFilterType.STATE:
        return this.eventModel.aggregate([
          {
            $match: { type: EventType.TIME_CONSTRAINED_EVENT },
          },
          {
            $match: {
              $and: [
                { startDate: { $gt: new Date() } },
                { endDate: { $gt: new Date() } },
              ],
            },
          },
          {
            $match: {
              'originLocation.state': locationFilterValue,
            },
          },
        ]);
    }
  }

  async findEventsByPostId(postID: Types.ObjectId) {
    const eventsContainsPosts = await this.eventModel.aggregate([
      {
        $match: {
          posts: postID,
        },
      },
      {
        $project: {
          _id: 1,
          posts: 1,
        },
      },
    ]);
    return eventsContainsPosts;
  }

  /***
   * Function to get all upcoming events
   */

  async findTodayEvents(
    locationFilterType: LocationFilterType,
    locationFilterValue?: string,
  ): Promise<Event[]> {
    switch (locationFilterType) {
      case LocationFilterType.GLOBAL:
        return this.eventModel.aggregate([
          {
            $match: { type: EventType.TIME_CONSTRAINED_EVENT },
          },
          {
            $match: {
              $and: [
                { startDate: { $lte: new Date() } },
                { endDate: { $gt: new Date() } },
              ],
            },
          },
        ]);
      case LocationFilterType.COUNTRY_AND_STATE:
        const countryAndState = locationFilterValue.split('_');
        const country = countryAndState[0];
        const state = countryAndState[1];
        return this.eventModel.aggregate([
          {
            $match: { type: EventType.TIME_CONSTRAINED_EVENT },
          },
          {
            $match: {
              $and: [
                { startDate: { $lte: new Date() } },
                { endDate: { $gt: new Date() } },
              ],
            },
          },
          {
            $match: {
              $and: [
                { 'originLocation.country': country },
                { 'originLocation.state': state },
              ],
            },
          },
        ]);
      case LocationFilterType.COUNTRY:
        return this.eventModel.aggregate([
          {
            $match: { type: EventType.TIME_CONSTRAINED_EVENT },
          },
          {
            $match: {
              $and: [
                { startDate: { $lte: new Date() } },
                { endDate: { $gt: new Date() } },
              ],
            },
          },
          {
            $match: {
              'originLocation.country': locationFilterValue,
            },
          },
        ]);
      case LocationFilterType.STATE:
        return this.eventModel.aggregate([
          {
            $match: { type: EventType.TIME_CONSTRAINED_EVENT },
          },
          {
            $match: {
              $and: [
                { startDate: { $lte: new Date() } },
                { endDate: { $gt: new Date() } },
              ],
            },
          },
          {
            $match: {
              'originLocation.state': locationFilterValue,
            },
          },
        ]);
    }
  }

  /***
   * Function to filter events by country and state value
   */
  async findEventByLocation(
    locationFilterType: LocationFilterType,
    locationFilterValue?: string,
  ): Promise<Event[]> {
    switch (locationFilterType) {
      case LocationFilterType.GLOBAL:
        return this.eventModel.aggregate([
          {
            $match: { type: EventType.TIME_CONSTRAINED_EVENT },
          },
          {
            $match: {
              $and: [
                { startDate: { $lte: new Date() } },
                { endDate: { $gt: new Date() } },
              ],
            },
          },
        ]);
      case LocationFilterType.COUNTRY_AND_STATE:
        const countryAndState = locationFilterValue.split('_');
        const country = countryAndState[0];
        const state = countryAndState[1];
        return this.eventModel.aggregate([
          {
            $match: { type: EventType.TIME_CONSTRAINED_EVENT },
          },
          {
            $match: {
              $and: [
                { startDate: { $lte: new Date() } },
                { endDate: { $gt: new Date() } },
              ],
            },
          },
          {
            $match: {
              $and: [
                { 'originLocation.country': country },
                { 'originLocation.state': state },
              ],
            },
          },
        ]);
      case LocationFilterType.COUNTRY:
        return this.eventModel.aggregate([
          {
            $match: { type: EventType.TIME_CONSTRAINED_EVENT },
          },
          {
            $match: {
              $and: [
                { startDate: { $lte: new Date() } },
                { endDate: { $gt: new Date() } },
              ],
            },
          },
          {
            $match: {
              'originLocation.country': locationFilterValue,
            },
          },
        ]);
      case LocationFilterType.STATE:
        return this.eventModel.aggregate([
          {
            $match: { type: EventType.TIME_CONSTRAINED_EVENT },
          },
          {
            $match: {
              $and: [
                { startDate: { $lte: new Date() } },
                { endDate: { $gt: new Date() } },
              ],
            },
          },
          {
            $match: {
              'originLocation.state': locationFilterValue,
            },
          },
        ]);
    }
  }

  /***
   * Function to get as per event type
   */
  async findEventByType(eventType: EventType): Promise<Event[]> {
    const events = this.eventModel.aggregate([
      {
        $match: { type: eventType },
      },
      {
        $lookup: {
          from: 'eventposts',
          localField: 'posts',
          foreignField: '_id',
          as: 'posts',
        },
      },
      {
        $unset: ['createdAt', 'updatedAt'],
      },
    ]);
    return events;
  }

  /***
   * Function to find quotes by categories
   */
  async findQuoteByCategory(category: QuoteCategories): Promise<Event[]> {
    const events = this.eventModel.aggregate([
      {
        $match: {
          $and: [{ type: EventType.ALL_TIME_EVENT }, { categories: category }],
        },
      },
    ]);
    return events;
  }
  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  /***
   * Function to update event
   */
  updateEvent(id: string, updateEventDto: UpdateEventDto) {
    const updateEvent = this.eventModel.findByIdAndUpdate(
      id,
      { $set: updateEventDto },
      { new: true },
    );
    return updateEvent;
  }

  /***
   * Function to update quote event
   */
  updateQuoteEvent(id: string, updateQuoteEventDto: UpdateQuoteEventDto) {
    const updateQuoteEvent = this.eventModel.findByIdAndUpdate(
      id,
      { $set: updateQuoteEventDto },
      { new: true },
    );
    return updateQuoteEvent;
  }

  commonEventUpdate(id: string, updateCommontEventDto: CommonUpdateEventDto) {
    const updatedEvent = this.eventModel.findByIdAndUpdate(
      id,
      { $set: updateCommontEventDto },
      { new: true },
    );
    return updatedEvent;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
