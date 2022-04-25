import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PostSize {
  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  width: number;
  @IsNumber()
  @ApiProperty()
  @IsNotEmpty()
  height: number;
}
