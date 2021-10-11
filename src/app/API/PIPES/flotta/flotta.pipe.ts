import { Pipe, PipeTransform } from '@angular/core';
import { isThisMinute } from 'date-fns';

@Pipe({
  name: 'flotta'
})
export class FlottaPipe implements PipeTransform {

  transform(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      const tmp = item;

      if (item.utente !== undefined && item.utente !== null) {
        item.utente.forEach(element => {
          if (tmp.username === undefined) {
            tmp.username = element.username;
          } else { tmp.username = tmp.username + ' , ' + element.username; }
        });
      } else { tmp.username = '-'; }

      myData.push(tmp);
    }
    return myData;
  }

  _transformListaServizi(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      const tmp = item;

      // if (item.unitcode !== undefined && item.unitcode !== null) {
      //   tmp.componente = item.unitcode;
      // } else { tmp.componente = '-'; }

      if (item.mezzo[0] !== undefined) {
        if (item.mezzo[0].targa !== null) {
          tmp.mezzo = item.mezzo[0].targa;
        } else if (item.mezzo[0].telaio !== null) {
          tmp.mezzo = item.mezzo[0].telaio;
        }
      } else { tmp.mezzo = '-'; }

      if (item.gps.length > 1) {
        item.gps.forEach(element => {
          if (element.servizio_componente.principale === true) {
            tmp.componente = element.unitcode;
          }
        });
      } else {
        tmp.componente = item.gps[0].unitcode;
      }

      tmp.nickname = item.pivot.nickname;
      tmp.icona = item.pivot.icona;

      if (item.dataFine == null) { tmp.dataFine = '-'; }

      myData.push(tmp);
    }
    return myData;
  }

  transformListaServizi(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      let tmp = item;

      if (item.applicativo) {
        tmp = {
          idServizio: item.idServizio,
          dataInizio: item.dataInizio,
          dataFine: item.dataFine,
          mezzo: item.mezzo,
          componente: item.periferica,
          nickname: null,
          icona: null
        };
      } else {

        tmp = {
          idServizio: item.idServizio,
          dataInizio: item.dataInizio,
          dataFine: (item.dataFine !== null) ? item.dataFine : null,
          mezzo: (item.targa !== null) ? item.targa : item.telaio,
          componente: item.unitcode,
          nickname: item.nickname,
          icona: item.icona
        };

      }

      myData.push(tmp);
    }
    return myData;
  }

  transformListaUtenti(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      let tmp = item;

      tmp = {
        idRiferimento: item.idRiferimento,
        idUtente: item.idUtente,
        username: item.username,
        nickname: item.nickname,
        principale: item.principale
      }

      myData.push(tmp);
    }
    return myData;
  }

  _transformListaUtenti(value: any): any[] {
    const myData = [];
    for (const item of value) {
      const tmp = item;

      tmp.principale = item.pivot.principale;
      tmp.nickname = item.pivot.nickname;

      myData.push(tmp);
    }
    return myData;
  }

  transformXServizio(value: any): any[] {
    const newArray = [];

    value.forEach(flotta => {
      const newObject = {
        id: flotta.id,
        nome: flotta.nome,
        nServizi: flotta.nservizio,
        utente: ''
      };

      flotta.utente.forEach(utenti => {
        newObject.utente = newObject.utente + ' ' + utenti.username;
      });

      newArray.push(newObject);
    });

    return newArray;
  }
}
