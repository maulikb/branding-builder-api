import { Module } from '@nestjs/common';
import { BusinessService } from './business.service';
import { BusinessController } from './business.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Business, BusinessSchema } from './entities/business.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Business.name,
        useFactory: () => {
          const schema = BusinessSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
