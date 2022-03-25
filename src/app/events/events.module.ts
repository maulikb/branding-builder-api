import { Logger, Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './entity/event.entity';
import { LoggingInterceptor } from '../common/interceptors/logger.interceptor';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Event.name,
        useFactory: () => {
          const schema = EventSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [EventsController],
  providers: [EventsService, LoggingInterceptor, Logger],
  exports: [EventsService],
})
export class EventsModule {}
