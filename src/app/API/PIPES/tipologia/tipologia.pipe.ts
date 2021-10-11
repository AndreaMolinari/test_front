import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipologia'
})
export class TipologiaPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

  transformNGSelect(value: any): any {
    let myData: string[] = [];
    for (let item of value) {
      let tmp = item;

      tmp.value = item.id;
      tmp.title = item.tipologia;

      myData.push(tmp);
    }
    return myData;
  }

}
