import { Pipe, PipeTransform } from '@angular/core';
import { NbToastrService } from '@nebular/theme';

@Pipe({
  name: 'componente'
})
export class ComponentePipe implements PipeTransform {

  constructor(private toastrService: NbToastrService) { }

  transform(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      const tmp = item;

      if (item.modello !== null) {
        tmp.marca = item.modello.brand.marca;
        tmp.modello = item.modello.modello;
      } else {
        tmp.marca = 'N/A';
        tmp.modello = 'N/A';
      }
      if (item.sim !== null) {
        tmp.sim = item.sim.serial;
      } else { tmp.sim = '--'; }

      myData.push(tmp);
    }
    return myData;
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

  transformInserimentoSpecial(value: any): any {
    let tmp = value;

    tmp = value.componente[0];
    tmp.sim = (value.componente[0].idSim !== null) ? {
      id: value.componente[0].idSim
    } : null;
    tmp.nota = (value.note[0] !== undefined && value.note[0].testo !== '' && value.note[0].testo !== null) ? value.note : null;

    return tmp;

  }

  transformInserimentoSpecialTacho(value: any): any {
    let tmp = value;

    tmp = value.tacho[0];
    // tmp.modello = {
    //   idModello: value.tacho[0].idModello
    // };
    tmp.sim = (value.tacho[0].idSim !== null) ? {
      id: value.tacho[0].idSim
    } : null;
    tmp.nota = (value.nota[0] && value.nota[0].testo) ? value.nota : null;

    return tmp;

  }

  transformCheckbox(value: any, modifica: boolean) {
    const myData: string[] = [];
    for (const item of value) {
      const tmp = item;

      if (modifica === true) {
        if (item.principale === 0 || item.principale == null) {
          tmp.principale = false;
        } else { tmp.principale = true; }
      } else {
        if (item.principale === false) {
          tmp.principale = 0;
        } else { tmp.principale = 1; }
      }

      myData.push(tmp);
    }
    return myData;
  }

  transformFormXModal(value: any): any {
    let newForm: any = {};
    if (value.componente[0]) {
      newForm = value.componente[0];

      if (value.componente[0].idSim) {
        newForm.sim = {
          id: value.componente[0].idSim
        };
      } else {
        newForm.sim = null;
      }

      newForm.nota = null;
      return newForm;
    } else {
      this.toastrService.danger('Impossibile preparare il form per l inserimento...', 'ERRORE API!');
      return value;
    }
  }
}
