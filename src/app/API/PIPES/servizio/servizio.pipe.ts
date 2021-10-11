import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'servizioPipe'
})
export class ServizioPipe implements PipeTransform {

  transform(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      const tmp = item;

      if (item.prezzo !== null) {
        tmp.prezzo = item.prezzo + ' €';
      } else { tmp.prezzo = '-'; }

      const dataPipe = new DatePipe('it-IT');
      tmp.dataInizio = dataPipe.transform(item.dataInizio, 'dd/MM/yyyy');
      tmp.dataFine = dataPipe.transform(item.dataFine, 'dd/MM/yyyy');

      if (item.dataSospFine) {
        tmp.dataInizio += ', <br> <b><u>' + dataPipe.transform(item.dataSospFine, 'dd/MM/yyyy') + '</u></b>';
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

      if (item.dataInizio == null) {
        tmp.dataInizio = '-';
      }
      if (item.dataFine == null) {
        tmp.dataFine = '-';
      }

      tmp.applicativoSolo = '';
      item.applicativo.forEach(app => {
        tmp.applicativoSolo = tmp.applicativoSolo + ' ' + app.applicativo;
      });

      switch (item.idCausale) {
        case 30: {
          tmp.causale = 'Noleggio';
          break;
        }
        case 31: {
          tmp.causale = 'Acquisto';
          break;
        }
        case 32: {
          tmp.causale = 'Conto Visione';
          break;
        }
        case 33: {
          tmp.causale = 'Omaggio';
          break;
        }
        default: {
          tmp.causale = '-';
          break;
        }
      }

      switch (item.idPeriodo) {
        case 51: {
          tmp.periodo = 'Mensile';
          break;
        }
        case 52: {
          tmp.periodo = 'Bimestrale';
          break;
        }
        case 53: {
          tmp.periodo = 'Trimestrale';
          break;
        }
        case 54: {
          tmp.periodo = 'Semestrale';
          break;
        }
        case 55: {
          tmp.periodo = 'Annuale';
          break;
        }
        case 69: {
          tmp.periodo = 'Triennale';
          break;
        }
        default: {
          tmp.periodo = '-';
          break;
        }
      }

      tmp.causalePeriodo = item.causale + ' , ' + item.periodo;

      if (item.mezzo[0] !== undefined) {
        item.mezzo.forEach(element => {
          if (element.idMezzo !== null) {
            if (tmp.veicolo === undefined) {
              tmp.veicolo = (element.targa !== null && element.targa !== '') ? element.targa : element.telaio;
            } else {
              tmp.veicolo = tmp.veicolo + ' - ' + (element.targa !== null && element.targa !== '') ? element.targa : element.telaio;
            }
          } else {
            tmp.veicolo = '--';
          }
        });
      } else { tmp.veicolo = '--'; }

      if (item.componente.length > 0) {
        // tmp.periferica = item.componente[0].unitcode;
        tmp.periferica = '';
        item.componente.forEach(comp => {
          tmp.periferica = tmp.periferica + ' ' + comp.unitcode;
        });
      } else { tmp.periferica = '--'; }

      if (item.tacho.length > 0) {
        // tmp.tachigrafo = item.tacho[0].unitcode;
        tmp.tachigrafo = '';
        item.tacho.forEach(tacho => {
          tmp.tachigrafo = tmp.tachigrafo + ' ' + tacho.unitcode;
        });
      } else { tmp.tachigrafo = '--'; }

      myData.push(tmp);
    }
    return myData;
  }

  transformByAnagrafica(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      const tmp = item;

      if (item.prezzo !== null) {
        tmp.prezzo = item.prezzo + ' €';
      } else { tmp.prezzo = '-'; }

      const dataPipe = new DatePipe('it-IT');
      tmp.dataInizio = dataPipe.transform(item.dataInizio, 'dd/MM/yyyy');
      tmp.dataFine = dataPipe.transform(item.dataFine, 'dd/MM/yyyy');

      if (item.dataSospFine) {
        tmp.dataInizio += ', <br> <b><u>' + dataPipe.transform(item.dataSospFine, 'dd/MM/yyyy') + '</u></b>';
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

      if (item.dataInizio == null) {
        tmp.dataInizio = '-';
      }
      if (item.dataFine == null) {
        tmp.dataFine = '-';
      }

      tmp.applicativoSolo = '';
      item.applicativo.forEach(app => {
        tmp.applicativoSolo = tmp.applicativoSolo + ' ' + app.applicativo;
      });

      // tmp.applicativoSolo = (item.applicativo.length > 0) ? item.applicativo[0].applicativo : '';

      switch (item.idCausale) {
        case 30: {
          tmp.causale = 'Noleggio';
          break;
        }
        case 31: {
          tmp.causale = 'Acquisto';
          break;
        }
        case 32: {
          tmp.causale = 'Conto Visione';
          break;
        }
        case 33: {
          tmp.causale = 'Omaggio';
          break;
        }
        default: {
          tmp.causale = '-';
          break;
        }
      }

      switch (item.idPeriodo) {
        case 51: {
          tmp.periodo = 'Mensile';
          break;
        }
        case 52: {
          tmp.periodo = 'Bimestrale';
          break;
        }
        case 53: {
          tmp.periodo = 'Trimestrale';
          break;
        }
        case 54: {
          tmp.periodo = 'Semestrale';
          break;
        }
        case 55: {
          tmp.periodo = 'Annuale';
          break;
        }
        case 69: {
          tmp.periodo = 'Triennale';
          break;
        }
        default: {
          tmp.periodo = '-';
          break;
        }
      }

      tmp.causalePeriodo = item.causale + ' , ' + item.periodo;

      // tmp.anagrafica = (item.anagrafica.ragSoc !== null) ? item.anagrafica.ragSoc : item.anagrafica.nome + ' ' + item.anagrafica.cognome;

      if (item.mezzo[0] !== undefined) {
        item.mezzo.forEach(element => {
          if (element.idMezzo !== null) {
            if (tmp.veicolo === undefined) {
              tmp.veicolo = (element.targa !== null && element.targa !== '') ? element.targa : element.telaio;
            } else {
              tmp.veicolo = tmp.veicolo + ' - ' + (element.targa !== null && element.targa !== '') ? element.targa : element.telaio;
            }
          } else {
            tmp.veicolo = '--';
          }
        });
      } else { tmp.veicolo = '--'; }

      if (item.componente.length > 0) {
        // tmp.periferica = item.componente[0].unitcode;
        tmp.periferica = '';
        item.componente.forEach(comp => {
          tmp.periferica = tmp.periferica + ' ' + comp.unitcode;
        });
      } else { tmp.periferica = '--'; }

      if (item.tacho.length > 0) {
        // tmp.tachigrafo = item.tacho[0].unitcode;
        tmp.tachigrafo = '';
        item.tacho.forEach(tacho => {
          tmp.tachigrafo = tmp.tachigrafo + ' ' + tacho.unitcode;
        });
      } else { tmp.tachigrafo = '--'; }

      myData.push(tmp);
    }
    return myData;
  }

  transformFiltro(value: any): any {
    const tmp = value;

    if (value.componente.length > 1) {
      tmp.periferica = value.componente[1].unitcode;
    } else { tmp.periferica = '--'; }

    if (value.tacho.length > 1) {
      tmp.tachigrafo = value.tacho[1].unitcode;
    } else { tmp.tachigrafo = '--'; }

    return tmp;
  }

  transform2Export(value: any, tipologie: []): any {
    const myData: string[] = [];
    for (const item of value) {
      let tmp = item;

      if (item.mezzo !== '--' && item.mezzo !== null) {
        tmp.mezzo = "'" + tmp.mezzo + "'";
      } else { tmp.mezzo = ''; }

      if (item.periferica !== '--') {
        tmp.periferica = "'" + tmp.periferica + "'";
      } else { tmp.periferica = ''; }

      if (item.tachigrafo !== '--') {
        tmp.tachigrafo = "'" + tmp.tachigrafo + "'";
      } else { tmp.tachigrafo = ''; }

      if (item.idPeriodo === '9999') {
        tmp.periodo = '';
      } else {
        tipologie.forEach((element: any) => {
          if (element.id === item.idPeriodo) { tmp.periodo = element.tipologia; }
        });
      }

      tmp = {
        id: tmp.id,
        anagrafica: tmp.anagrafica,
        dataInizio: tmp.dataInizio,
        dataFine: tmp.dataFine,
        periodo: tmp.periodo,
        prezzo: tmp.prezzo,
        causale: tmp.causale,
        mezzo: tmp.mezzo,
        periferica: tmp.periferica,
        tachigrafo: tmp.tachigrafo
      }

      myData.push(tmp);
    }
    return myData;
  }

  transformNGSelect(value: any): any {
    const myData: string[] = [];
    for (const item of value) {
      const tmp = item;

      tmp.id = item.id;
      tmp.value = item.targa;
      tmp.title = item.targa;

      myData.push(tmp);
    }
    return myData;
  }

  transformInserimentoTable(value: any): any {
    const tmp = value;
    tmp.idServizio = value.id;
    tmp.id = null;
    tmp.componente = (value.periferica !== '-' ? value.periferica : value.tachigrafo);
    tmp.mezzo = value.veicolo;
    tmp.nickname = null;
    tmp.icona = null;

    return tmp;
  }

  transformInserimentoTableSPECIAL(value: any): any {
    const tmp = value;
    tmp.idServizio = value.id;
    tmp.id = null;
    tmp.componente = (value.componente.length > 0) ? value.componente[0].idComponente : null;
    tmp.mezzo = (value.mezzo.length > 0) ? value.mezzo[0].idMezzo : null;
    tmp.nickname = null;
    tmp.icona = null;

    return tmp;
  }

}
