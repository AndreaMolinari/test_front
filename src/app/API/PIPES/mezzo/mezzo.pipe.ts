import { Pipe, PipeTransform } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { Observable } from 'rxjs';

@Pipe({
  name: 'mezzoPipe'
})

export class MezzoPipe implements PipeTransform {

  constructor(private toastrService: NbToastrService) { }

  transform(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      const tmp = item;


      if (item.targa !== '' && item.telaio !== '' && item.targa !== null && item.telaio !== null) {
        // tmp.identificativo = item.targa + ' / ' + item.talaio;
        tmp.identificativo = item.targa;
      } else if (item.targa !== '' && item.targa !== null) {
        tmp.identificativo = item.targa;
      } else if (item.telaio !== '' && item.telaio !== null) {
        tmp.identificativo = item.telaio;
      } else {
        tmp.identificativo = '-';
      }

      if (item.modello !== null) {
        tmp.marca = (item.modello.brand) ? item.modello.brand.marca : '--';
        tmp.modello = item.modello.modello;
      } else {
        tmp.modello = '--';
        tmp.marca = '--';
      }

      // if (item.bloccato == null || item.bloccato == 0) {
      //   tmp.bloccato = 'No';
      // } else { tmp.bloccato = 'Bloccato'; }
      myData.push(tmp);
    }
    return myData;
  }

  transformMezzoSelect(value: any): any {
    let myData: string[] = [];
    for (let item of value) {
      let tmp = item;
      if (item.targa !== '' && item.telaio !== '' && item.targa !== null && item.telaio !== null) {
        // tmp.identificativo = item.targa + ' / ' + item.talaio;
        tmp.identificativo = item.targa;
      } else if (item.targa !== '' && item.targa !== null) {
        tmp.identificativo = item.targa;
      } else if (item.telaio !== '' && item.telaio !== null) {
        tmp.identificativo = item.telaio;
      }
      if (item.targa == null && item.telaio == null) {
        tmp.identificativo = 'Targa/Telaio Mancante!'
      }
      myData.push(tmp);
    }
    return myData;
  }

  transformInserimento(value: any): any {
    const newObj = value.veicolo[0];

    value.note.forEach((nota, i) => {
      if (nota.testo == null || nota.testo === '') {
        value.note.splice(i);
      }
    });

    newObj.nota = (value.note.length > 0) ? value.note : null;
    return newObj;
  }

  transformFormXModal(value: any): any {
    let newValue: any = {};
    if (value.veicolo[0]) {
      newValue = value.veicolo[0];
      newValue.nota = value.note;
      return newValue;
    } else {
      this.toastrService.danger('Si è verificato un errore nella preparazione del form...', 'ERRORE!');
      return value;
    }
  }

}
