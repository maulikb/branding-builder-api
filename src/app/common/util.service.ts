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

  public hexToRgbA(hexString) {
    let hex;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexString)) {
      hex = hexString.substring(1).split('');
      if (hex.length == 3) {
        hex = [hex[0], hex[0], hex[1], hex[1], hex[2], hex[2]];
      }
      hex = '0x' + hex.join('');
      const red = (hex >> 16) & 255;
      const green = (hex >> 8) & 255;
      const blue = hex & 255;
      const alpha = 1;
      return { red: red, green: green, blue: blue, alpha: alpha };
    }
    throw new Error('Bad Hex');
  }
}
