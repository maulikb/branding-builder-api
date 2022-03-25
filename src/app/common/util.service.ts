import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  public removeElementFromArray(array: Array<any>, element: any) {
    const index = array.indexOf(element);
    if (index > -1) {
      array.splice(index, 1); // 2nd parameter means remove one item only
    }
    return array;
  }
}
