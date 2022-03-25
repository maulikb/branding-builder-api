import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { IEnvironmentVariables } from './common/@types/IEnvironemntVariable';
import { configuration } from './configuration/config';
import { EventsModule } from './events/events.module';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { MediaModule } from './media/media.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { CommonModule } from './common/common.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'path';
import { PostsModule } from './posts/posts.module';

const publicFolderPath = '../../public/temp';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService<IEnvironmentVariables>) => ({
        uri: config.get('MONGO_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
    }),
    EventEmitterModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, publicFolderPath),
      serveRoot: '/media/',
    }),
    EventsModule,
    CommonModule,
    TerminusModule,
    MediaModule,
    PostsModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
