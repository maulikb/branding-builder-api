import { IsNotEmpty } from 'class-validator';
import { Event } from '../entity/event.entity';
export class CreateEventDto extends Event {
  @IsNotEmpty()
  readonly startDate: Date;
  @IsNotEmpty()
  readonly endDate: Date;
}
