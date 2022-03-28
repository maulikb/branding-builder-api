import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { EventsService } from './events.service';
import {
  CreateEventDto,
  CreateEventReqSwagger,
  CreateEventResSwagger,
} from './dto/create-event.dto';
import { Event } from './entity/event.entity';
import {
  CreateQuoteEventDto,
  CreateQuoteEventReqSwaggerDto,
  CreateQuoteEventResSwaggerDto,
} from './dto/create-quote-event.dto';
import { EventType } from './@types/event-type';
import { QuoteCategories } from './@types/quote-categories';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommonApiResponses } from '../common/decorators/common-swagger.decorator';
import { LoggingInterceptor } from '../common/interceptors/logger.interceptor';
import { LocationFilterType } from './@types/location-filter-type';

/***
 * Event Handlers
 */

@Controller({ path: 'api/', version: '1' })
@UseInterceptors(LoggingInterceptor)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /***
   * Register New Event With Unique Name
   */
  @Post('register-events')
  @ApiTags('Events')
  @ApiBody({ type: CreateEventReqSwagger })
  @ApiConsumes('application/json')
  @ApiOperation({ summary: 'Register New Event' })
  @ApiResponse({ type: CreateEventResSwagger, status: HttpStatus.OK })
  @CommonApiResponses()
  async registerEvent(@Body() createEventDto: CreateEventDto) {
    const event = await this.eventsService.createEvent(createEventDto);
    return event;
  }
  /***
   * Get Today Events
   */
  @Get('today-events')
  @ApiTags('Events')
  @ApiOperation({ summary: 'Get Today Events' })
  @ApiQuery({
    name: 'Country',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'State',
    required: false,
    type: String,
  })
  @ApiResponse({ type: CreateEventResSwagger, status: HttpStatus.OK })
  @CommonApiResponses()
  async getTodayEvents(
    @Query('Country') originCountry: string,
    @Query('State') originState: string,
  ): Promise<Event[]> {
    if (originState !== undefined && originCountry !== undefined) {
      return await this.eventsService.findTodayEvents(
        LocationFilterType.COUNTRY_AND_STATE,
        originCountry + '_' + originState,
      );
    }
    if (originState !== undefined) {
      return await this.eventsService.findTodayEvents(
        LocationFilterType.STATE,
        originState,
      );
    }
    if (originCountry !== undefined) {
      return await this.eventsService.findTodayEvents(
        LocationFilterType.COUNTRY,
        originCountry,
      );
    }
    return await this.eventsService.findTodayEvents(LocationFilterType.GLOBAL);
  }

  /***
   * Get Upcoming Events
   */
  @Get('upcoming-events')
  @ApiTags('Events')
  @ApiOperation({ summary: 'Get Upcoming Events' })
  @ApiQuery({
    name: 'Country',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'State',
    required: false,
    type: String,
  })
  @ApiResponse({ type: CreateEventResSwagger, status: HttpStatus.OK })
  @CommonApiResponses()
  async getUpcomingEvents(
    @Query('Country') originCountry: string,
    @Query('State') originState: string,
  ): Promise<Event[]> {
    if (originState !== undefined && originCountry !== undefined) {
      return await this.eventsService.findUpcomingEvents(
        LocationFilterType.COUNTRY_AND_STATE,
        originCountry + '_' + originState,
      );
    }
    if (originState !== undefined) {
      return await this.eventsService.findUpcomingEvents(
        LocationFilterType.STATE,
        originState,
      );
    }
    if (originCountry !== undefined) {
      return await this.eventsService.findUpcomingEvents(
        LocationFilterType.COUNTRY,
        originCountry,
      );
    }
    return await this.eventsService.findUpcomingEvents(
      LocationFilterType.GLOBAL,
    );
  }

  /***
   * Get All Events
   */
  @Get('events')
  @ApiTags('Events')
  @ApiOperation({ summary: 'Get All Events' })
  @ApiResponse({ type: CreateEventResSwagger, status: HttpStatus.OK })
  @CommonApiResponses()
  async getAllEvents(): Promise<Event[]> {
    return await this.eventsService.findEventByType(
      EventType.TIME_CONSTRAINED_EVENT,
    );
  }

  /***
   * Register New Quote With Unique Name
   */
  @Post('register-quote')
  @ApiTags('Quotes')
  @ApiBody({ type: CreateQuoteEventReqSwaggerDto })
  @ApiOperation({ summary: 'Reister New Quote With Unique Name' })
  @ApiResponse({ type: CreateQuoteEventResSwaggerDto, status: HttpStatus.OK })
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
  @ApiOperation({ summary: ' Get Quote By Category' })
  @ApiResponse({ type: CreateQuoteEventResSwaggerDto, status: HttpStatus.OK })
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
  @ApiOperation({ summary: 'Get All Quotes' })
  @ApiResponse({ type: CreateQuoteEventResSwaggerDto, status: HttpStatus.OK })
  @CommonApiResponses()
  async getAllQuotes(): Promise<Event[]> {
    return await this.eventsService.findEventByType(EventType.ALL_TIME_EVENT);
  }
}
