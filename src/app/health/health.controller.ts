import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller({ path: 'api/health', version: '1' })
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongo: MongooseHealthIndicator,
  ) {}

  /***
   * Function to check database and server availibility
   */
  @Get()
  @HealthCheck()
  @ApiTags('Health Check')
  @ApiOperation({ summary: 'Check Status Of Database And Server' })
  check() {
    return this.health.check([async () => this.mongo.pingCheck('mongo')]);
    throw new Error('Not implemented');
  }
}
