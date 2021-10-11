import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'brand'
})
export class BrandPipe implements PipeTransform {

  transform(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      const tmp = item;

      if (item.bloccato) {
        tmp.bloccato = 'Bloccato';
      } else {
        tmp.bloccato = 'No';
      }

      myData.push(tmp);
    }
    return myData;
  }

  transformNGSelect(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      const tmp = item;

      tmp.value = item.marca;
      tmp.title = item.marca;

      myData.push(tmp);
    }
    return myData;
  }

}
