import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'modello'
})
export class ModelloPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

  transformList(value: any[]): any[] {
    const newData = [];
    value.forEach(modello => {
      const newModello = modello;
      newModello.marca = (modello.brand !== null) ? modello.brand.marca : '--';
      newModello.tipologia = (modello.tipologia !== null) ? modello.tipologia.tipologia : '--';
      newData.push(newModello);
    });

    return newData;
  }

  transformNGSelect(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      const tmp = item;
      tmp.value = item.modello;
      tmp.title = item.modello;

      myData.push(tmp);
    }
    return myData;
  }

}
