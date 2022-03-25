import {
  ArgumentMetadata,
  HttpStatus,
  PipeTransform,
  ValidationError,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CustomErrorCodes } from '../@types/custom-error-codes';
import { CustomHTTPException } from '../errors/custom-http.exception';

export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    value = this.trim(value);
    const object = plainToClass(metatype, value);
    const errors: ValidationError[] = await validate(object, {});
    if (errors.length > 0) {
      throw new CustomHTTPException(
        {
          key: 'errors.VALIDATION_FAILED',
          logInfo: errors,
        },
        HttpStatus.BAD_REQUEST,
        CustomErrorCodes.VALIDATION_FAILED,
      );
    }
    return object;
  }
  private trim(value: any) {
    if (value && typeof value === 'string') {
      return value.trim();
    }
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.map((v) => this.trim(v));
      }
      return Object.keys(value).reduce((acc, key) => {
        acc[key] = this.trim(value[key]);
        return acc;
      }, {});
    }
    return value;
  }

  private toValidate(metatype: new (...args: any[]) => any): boolean {
    const types: (new (...args: any[]) => any)[] = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype);
  }
}
