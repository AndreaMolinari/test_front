import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sim'
})

export class SimPipe implements PipeTransform {

  transform(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      const tmp = item;

      if (item.apn == null) {
        tmp.apn = '--';
      }

      if (item.bloccato !== 0) {
        tmp.bloccato = 'Bloccata';
      } else { tmp.bloccato = 'No'; }

      myData.push(tmp);
    }
    return myData;
  }

  transformInserimento(value: any, modifica: boolean): any {
    if (typeof (value) === 'object') {
      const myData: string[] = [];

      const tmp = value;

      if (modifica === true) {
        if (value.bloccato === 0 || value.bloccato == null) {
          tmp.bloccato = false;
        } else { tmp.bloccato = true; }
      } else {
        if (value.bloccato === false) {
          tmp.bloccato = 0;
        } else { tmp.bloccato = 1; }
      }
      myData.push(tmp);
      return myData;

    } else {
      const myData: string[] = [];
      for (const item of value) {
        const tmp = item;

        if (modifica === true) {
          if (item.bloccato === 0 || item.bloccato == null) {
            tmp.bloccato = false;
          } else { tmp.bloccato = true; }
        } else {
          if (item.bloccato === false) {
            tmp.bloccato = 0;
          } else { tmp.bloccato = 1; }
        }

        myData.push(tmp);
      }
      return myData;
    }
  }

  transformSelectBrand(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      const tmp = item;

      item.modello.forEach(element => {
        tmp.id = element.id;
        tmp.modello = item.marca + ' - ' + element.modello;
      });

      myData.push(tmp);
    }
    return myData;
  }

  formatMassiveInsert(file: any): any {
    const array = file.split('\r\n');

    const result = [];
    const headers = array[0].split(';');
    array.splice(0, 1);


    array.forEach((element, i) => {
      array[i] = element.split(';'); // so troppo forte

      const obj: Record<string, string | object> = {};

      for (let x = 0; x < headers.length; x++) {

        switch (x) {
          case 0:
            obj.unitcode = array[i][x];
            break;
          case 1:
            obj.idModello = array[i][x];
            break;
          case 2:
            obj.sim = {
              serial: array[i][x]
            };
            break;
          case 3:
            if (obj.sim !== undefined) {
              obj.sim['idModello'] = array[i][x];
            }
            break;
        }
      }

      result.push(obj);

    });

    return result;
  }

  formatMassiveTable(value: any): any {
    const newArray = [];

    value.forEach(componente => {
      const newComponente = {
        unitcode: componente.unitcode,
        modelloGPS: componente.idModello,
        serial: (componente.sim !== undefined) ? componente.sim.serial : '--',
        modelloSIM: (componente.sim !== undefined) ? componente.sim.idModello : '--'
      };
      newArray.push(newComponente);
    });

    return newArray;
  }

}
