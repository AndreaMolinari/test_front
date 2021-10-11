import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fatturazioneInserimento'
})
export class FatturazioneInserimentoPipe implements PipeTransform {

  transform(value: any, modifica: boolean): any {
    let myData: string[] = [];
    for (const item of value) {
      let tmp = item;

      if (modifica === true) {
        if (item.splitPA === 0) {
          tmp.splitPA = false;
        } else { tmp.splitPA = true; }

        if (item.esenteIVA === 0) {
          tmp.esenteIVA = false;
        } else { tmp.esenteIVA = true; }

        if (item.speseSpedizione === 0) {
          tmp.speseSpedizione = false;
        } else { tmp.speseSpedizione = true; }

        if (item.speseIncasso === 0) {
          tmp.speseIncasso = false;
        } else { tmp.speseIncasso = true; }
      } else {
        if (item.splitPA === false) {
          tmp.splitPA = 0;
        } else { tmp.splitPA = 1; }

        if (item.esenteIVA === false) {
          tmp.esenteIVA = 0;
        } else { tmp.esenteIVA = 1; }

        if (item.speseSpedizione === false) {
          tmp.speseSpedizione = 0;
        } else { tmp.speseSpedizione = 1; }

        if (item.speseIncasso === false) {
          tmp.speseIncasso = 0;
        } else { tmp.speseIncasso = 1; }
      }

      myData.push(tmp);
    }
    return myData;
  }

}
