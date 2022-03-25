import { IsNumber } from 'class-validator';

export class PostSize {
  @IsNumber()
  width: number;
  @IsNumber()
  height: number;
}
