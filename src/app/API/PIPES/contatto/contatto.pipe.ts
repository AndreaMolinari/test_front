import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contatto'
})
export class ContattoPipe implements PipeTransform {

  transform(value: any): any {
    let myData: string[] = [];
    for (let item of value) {
      let tmp = item;

      if (item.anagrafica == null || item.anagrafica == undefined || item.anagrafica == ''){
        tmp.anagrafica = '<b> N/A </b>';
      }

      if (item.predefinito == 0) {
        tmp.predefinito = "No";
      } else {tmp.predefinito = "Si"}
      myData.push(tmp);
    }
    return myData;
  }

  transformNGSelect(value: any): any {
    let myData: string[] = [];
    for (let item of value) {
      let tmp = item;

      tmp.value = item.tipologia;
      tmp.title = item.tipologia;

      myData.push(tmp);
    }
    return myData;
  }

}
