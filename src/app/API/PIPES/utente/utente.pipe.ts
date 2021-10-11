import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utente'
})

export class UtentePipe implements PipeTransform {

  transform(value: any): any {
    let myData: string[] = [];
    for (let item of value) {
      let tmp = item;
      if (item.nome == null || item.nome == '') {
        tmp.anagrafica = item.ragSoc;
      } else {
        tmp.anagrafica = item.nome + ' ' + item.cognome;
      }

      if (item.actiaUser != null && item.actiaUser != '') {
        tmp.actiaUser = item.actiaUser;
      } else { tmp.actiaUser = '--' }

      if (item.bloccato == null || item.bloccato == 0) {
        tmp.bloccato = 'No';
      } else if (item.bloccato == 1) {
        tmp.bloccato = 'Bloccato';
      }

      myData.push(tmp);
    }
    return myData;
  }

  transformInserimento(value: any, modifica: boolean): any {
    const myData: object[] = [];

    value.forEach(user => {
      const tmp = user;
      if (modifica === true) {

        tmp.bloccato = (user.bloccato == 1) ? true : false;

      } else if (modifica == false) {

        tmp.bloccato = (user.bloccato == true) ? 1 : 0;

      }

      if (value.password === '' && value.password_confirmation === '') {
        delete user.password;
        delete user.password_confirmation;
      }

      myData.push(tmp);
    });

    // for (let item of value) {
    //   let tmp = item;
    //   if (modifica == true) {
    //     if (item.bloccato == 1) {
    //       tmp.bloccato = true;
    //     } else { tmp.bloccato = false; }
    //   }
    //   else if (modifica == false) {
    //     if (item.bloccato == true) {
    //       tmp.bloccato = 1;
    //     } else { tmp.bloccato = 0; }
    //   }
    //   if (value.password == '' && value.password_confirmation == '') {
    //     delete item.password;
    //     delete item.password_confirmation;
    //   }
    //   myData.push(tmp);
    // }

    return myData;
  }

  transformNGSelect(value: any): any {
    let myData: string[] = [];
    for (let item of value) {
      let tmp = item;

      tmp.id = item.id;
      tmp.value = item.username;
      tmp.title = item.username;

      myData.push(tmp);
    }
    return myData;
  }

  transformSelectTable(value: any): any {
    let myData: string[] = [];
    for (let item of value) {
      let tmp = item;

      tmp.value = item.tipologia;
      tmp.title = item.tipologia;

      myData.push(tmp);
    }
    return myData;
  }

  transformInserimentoTable(value: any, defaultNick: string): any {
    const tmp = value;

    tmp.idUtente = value.id;
    tmp.id = null;
    tmp.bloccato = (value.bloccato === 'No') ? 0 : 1;
    tmp.principale = false;
    if (defaultNick !== '') { tmp.nickname = defaultNick; }

    return tmp;
  }

}
