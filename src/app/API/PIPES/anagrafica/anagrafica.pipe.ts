import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'anagraficaPipe'
})
export class AnagraficaPipe implements PipeTransform {

  transform(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      const tmp = item;
      if (item !== null) {

        if (item.ragSoc === '' || item.ragSoc == null) {
          tmp.nome = item.nome + ' ' + item.cognome;
        } else {
          tmp.nome = item.ragSoc;
        }

        if (item.servizio.totale === undefined) {
          tmp.servizi = 0;
        } else {
          tmp.servizi = item.servizio.totale;
        }

        if (item.anagraficaParent !== null) {
          if (item.anagraficaParent.id === 40) {
            tmp.parent = 'MLS';
          } else {
            tmp.parent = (item.anagraficaParent.ragSoc == null) ?
              item.anagraficaParent.nome + ' ' + item.anagraficaParent.cognome : item.anagraficaParent.ragSoc;
          }
        } else {
          tmp.parent = 'Record';
        }

        if (item.pIva === '' || item.pIva == null) {
          tmp.codFisc = item.codFisc;
        } else {
          tmp.codFisc = item.pIva;
        }

        switch (item.idGenere) {
          case 20:
            tmp.genere = 'Persona Fisica';
            break;

          case 21:
            tmp.genere = 'Persona Giuridica';
            break;

          case 22:
            tmp.genere = 'Ente Pubblico';
            break;

          case 102:
            tmp.genere = 'Associazione';
            break;

          default:
            tmp.genere = '';
            break;
        }

        if (item.bloccato == null || item.bloccato == 0) {
          tmp.bloccato = 'No';
        } else { tmp.bloccato = 'Bloccato'; }

        myData.push(tmp);
      } else { alert('Ne ho trovato uno NULL!'); }
    }
    return myData;
  }

  transformLatests(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      const tmp = item;
      if (item != null) {
        if (item.ragSoc === '' || item.ragSoc == null) {
          tmp.nome = item.nome + ' ' + item.cognome;
        } else {
          tmp.nome = item.ragSoc;
        }

        tmp.servizi = item.servizi_count;



        if (item.anagraficaParent !== null) {
          if (item.anagraficaParent.id === 40) {
            tmp.parent = 'MLS';
          } else {
            tmp.parent = (item.anagraficaParent.ragSoc == null) ?
              item.anagraficaParent.nome + ' ' + item.anagraficaParent.cognome : item.anagraficaParent.ragSoc;
          }
        } else {
          tmp.parent = 'Record';
        }

        if (item.servizio.totale === undefined) {
          tmp.servizi = 0;
        } else {
          tmp.servizi = item.servizio.totale;
        }

        if (item.pIva === '' || item.pIva == null) {
          tmp.codFisc = item.codFisc;
        } else {
          tmp.codFisc = item.pIva;
        }

        myData.push(tmp);
      } else { alert('Ne ho trovato uno NULL!'); }
    }
    return myData;
  }

  transform2Export(value: any): any {
    let myData: string[] = [];
    for (let item of value) {
      let tmp = item;

      if (item.servizi == '+') {
        tmp.servizi = 'N/A'
      }

      tmp = {
        id: tmp.id,
        nome: tmp.nome,
        codFisc: tmp.codFisc,
        sesso: tmp.sesso,
        servizi: tmp.servizi,
        bloccato: tmp.bloccato
      }

      myData.push(tmp);
    }
    return myData;
  }

  anagraficaRelazioneLista(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      const tmp = item;
      tmp.id = item.anagrafica.id;
      tmp.sesso = item.anagrafica.idGenere;
      tmp.servizi = item.anagrafica.servizi;
      if (item.anagrafica.ragSoc === '' || item.anagrafica.ragSoc == null) {
        tmp.nome = item.anagrafica.nome + ' ' + item.anagrafica.cognome;
      } else {
        tmp.nome = item.anagrafica.ragSoc;
      }
      if (item.anagrafica.pIva === '' || item.anagrafica.pIva == null) {
        tmp.codFisc = item.anagrafica.codFisc;
      } else {
        tmp.codFisc = item.anagrafica.pIva;
      }
      if (item.anagrafica.bloccato == null || item.anagrafica.bloccato == 0) {
        tmp.bloccato = 'No';
      } else { tmp.bloccato = 'Bloccato'; }

      myData.push(tmp);
    }
    return myData;
  }

  transformAnagraficaShort(value: any): any {
    const myData = [];
    value.forEach(anagrafica => {
      const tmp = anagrafica;

      tmp.nome = (anagrafica.ragSoc == null) ? anagrafica.nome + ' ' + anagrafica.cognome : anagrafica.ragSoc;

      myData.push(tmp);
    });
    return myData;
  }

  transformListaSottoAnagrafica(value: any): any {
    const myData: string[] = [];

    value.forEach(anagrafica => {
      const tmp = anagrafica;

      tmp.nome = (anagrafica.ragSoc !== null) ? anagrafica.ragSoc : anagrafica.nome + ' ' + anagrafica.cognome;
      tmp.codFisc = (anagrafica.pIva !== null) ? anagrafica.pIva : anagrafica.codFisc;
      tmp.nServizi = (anagrafica.servizio === undefined) ? 'N/A' :
        (anagrafica.servizio.totale !== undefined) ? anagrafica.servizio.totale : 0;
      tmp.relazione = anagrafica.tipologia;

      myData.push(tmp);
    });

    return myData;
  }

}
