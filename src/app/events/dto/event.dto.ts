import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EventType } from '../@types/event-type';

export class EventDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsEnum(EventType)
  readonly type: EventType;

  @IsNotEmpty()
  @IsString()
  readonly description: string;
  @IsNotEmpty()
  readonly languages: string[];
  @IsOptional()
  readonly location?: {
    country: string[];
    state: string[];
  };
}
