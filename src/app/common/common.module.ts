import { Logger, Module } from '@nestjs/common';
import { LoggingInterceptor } from './interceptors/logger.interceptor';
import { CustomValidationPipe } from './pipes/custom-validation.pipe';
import { UtilService } from './util.service';

@Module({
  imports: [],
  providers: [CustomValidationPipe, Logger, LoggingInterceptor, UtilService],
  exports: [CustomValidationPipe, Logger, LoggingInterceptor, UtilService],
})
export class CommonModule {}
