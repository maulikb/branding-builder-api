import { IsEnum, IsNotEmpty } from 'class-validator';
import { QuoteCategories } from '../@types/quote-categories';
import { Event } from '../entity/event.entity';
export class CreateQuoteEventDto extends Event {
  @IsNotEmpty()
  @IsEnum(QuoteCategories)
  readonly categories: QuoteCategories;
}
