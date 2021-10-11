import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fatturazione'
})
export class FatturazionePipe implements PipeTransform {

  transform(value: any): any {
    let myData: string[] = [];
    for (let item of value) {
      let tmp = item;
      
      if (item.splitPA == 0) {
        tmp.splitPA = "No";
      } else {tmp.splitPA = "Si"}
      
      if (item.esenteIVA == 0) {
        tmp.esenteIVA = "No";
      } else {tmp.esenteIVA = "Esente IVA"}
      myData.push(tmp);
    }
    return myData;
  }

}
