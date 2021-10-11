import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contattoCrea'
})
export class ContattoCreaPipe implements PipeTransform {

  transform(value: any, modifica: boolean): any {
    let myData: string[] = [];
    for (let item of value) {
      let tmp = item;
      
      if (modifica == true) {
        if (item.predefinito == 0) {
          tmp.predefinito = false;
        } else {tmp.predefinito = true}
      } else {
          if (item.predefinito == false) {
            tmp.predefinito = 0;
          } else {tmp.predefinito = 1}
      }

      myData.push(tmp);
    }
    return myData;
  }

}
