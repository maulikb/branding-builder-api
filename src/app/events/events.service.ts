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
  async findUpcomingEvents(): Promise<Event[]> {
    const upcomingEvents = this.eventModel.aggregate([
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
    return upcomingEvents;
  }

  /***
   * Function to get all upcoming events
   */

  async findTodayEvents(): Promise<Event[]> {
    const todayEvents = this.eventModel.aggregate([
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
    return todayEvents;
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
  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
