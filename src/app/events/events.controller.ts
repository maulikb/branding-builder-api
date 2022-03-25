import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entity/event.entity';
import { CreateQuoteEventDto } from './dto/create-quote-event.dto';
import { EventType } from './@types/event-type';
import { QuoteCategories } from './@types/quote-categories';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommonApiResponses } from '../common/decorators/common-swagger.decorator';
import { GetQuoteSwaggerResponseDto } from './dto/get-quote-swagger-response.dto';
import { LoggingInterceptor } from '../common/interceptors/logger.interceptor';
import { GetEventSwaggerResponse } from './dto/get-event-swagger-response.dto';

/***
 * Event Handlers
 */

@Controller('api/')
@UseInterceptors(LoggingInterceptor)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /***
   * Regsiter New Event With Unique Name
   */
  @Post('register-events')
  @ApiTags('Events')
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ type: CreateEventDto, status: HttpStatus.OK })
  @CommonApiResponses()
  async registerEvent(@Body() CreateEventDto: CreateEventDto) {
    const event = await this.eventsService.createEvent(CreateEventDto);
    return event;
  }
  /***
   * Get Today Events
   */
  @Get('today-events')
  @ApiTags('Events')
  @ApiResponse({ type: GetEventSwaggerResponse, status: HttpStatus.OK })
  @CommonApiResponses()
  async getTodayEvents(): Promise<Event[]> {
    return await this.eventsService.findTodayEvents();
  }

  /***
   * Get Upcoming Events
   */
  @Get('upcoming-events')
  @ApiTags('Events')
  @ApiResponse({ type: GetEventSwaggerResponse, status: HttpStatus.OK })
  @CommonApiResponses()
  async getUpcomingEvents(): Promise<Event[]> {
    return await this.eventsService.findUpcomingEvents();
  }

  /***
   * Get All Events
   */
  @Get('events')
  @ApiTags('Events')
  @ApiResponse({ type: GetEventSwaggerResponse, status: HttpStatus.OK })
  @CommonApiResponses()
  async getAllEvents(): Promise<Event[]> {
    return await this.eventsService.findEventByType(
      EventType.TIME_CONSTRAINED_EVENT,
    );
  }

  /***
   * Reister New Quote With Unique Name
   */
  @Post('register-quote')
  @ApiTags('Quotes')
  @ApiBody({ type: CreateQuoteEventDto })
  @ApiResponse({ type: CreateQuoteEventDto, status: HttpStatus.OK })
  @CommonApiResponses()
  async registerQuote(@Body() createQuoteEventDto: CreateQuoteEventDto) {
    const event = await this.eventsService.createQuote(createQuoteEventDto);
    return event;
  }

  /***
   * Get Quote By Category
   */
  @Get('quotes/:QUOTE_CATEGORY')
  @ApiTags('Quotes')
  @ApiResponse({ type: GetQuoteSwaggerResponseDto, status: HttpStatus.OK })
  @CommonApiResponses()
  async getQuoteByCatogories(
    @Param('QUOTE_CATEGORY') quoteCategory: QuoteCategories,
  ): Promise<Event[]> {
    return await this.eventsService.findQuoteByCategory(quoteCategory);
  }

  /***
   * Get All Quotes
   */
  @Get('quotes')
  @ApiTags('Quotes')
  @ApiResponse({ type: GetQuoteSwaggerResponseDto, status: HttpStatus.OK })
  @CommonApiResponses()
  async getAllQuotes(): Promise<Event[]> {
    return await this.eventsService.findEventByType(EventType.ALL_TIME_EVENT);
  }
}
