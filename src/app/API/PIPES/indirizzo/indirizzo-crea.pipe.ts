import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indirizzoCrea'
})
export class IndirizzoCreaPipe implements PipeTransform {

  transform(value: any, modifica: boolean): any {
    let myData: string[] = [];
    for (let item of value) {
      let tmp = item;

      if (modifica == true) {
        if (item.predefinito == 0) {
          tmp.predefinito = false;
        } else { tmp.predefinito = true }
      } else {
        if (item.predefinito == false) {
          tmp.predefinito = 0;
        } else { tmp.predefinito = 1 }
      }

      myData.push(tmp);
    }
    return myData;
  }

  transformLista(value: any): any {
    let myData: string[] = [];
    for (let item of value) {
      let tmp = item;

      if (item.nome == undefined){
        tmp.nome = '-';
      }

      if (item.nazione == '' || item.nazione == null){
        tmp.nazione = 'N/A';
      }

      if (item.civico == '' || item.civico == null){
        tmp.civico = 'SNC';
      }

      myData.push(tmp);
    }
    return myData;
  }

}
