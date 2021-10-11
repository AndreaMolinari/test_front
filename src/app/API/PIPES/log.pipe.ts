import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'log'
})
export class LogPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

  logUtenteLista(value: any): any {
    let _dataPipe = new DatePipe('it-IT');
    let myData: string[] = [];
    for (let item of value){
      let tmp = item;

      tmp.data = '<b>' + _dataPipe.transform(item.dataLogin, 'dd/MMM/yyyy') + '</b>';
      tmp.ora = '<b>' + _dataPipe.transform(item.dataLogin, 'HH:mm') + '</b>';

      if (item.utente !== undefined) {
        tmp.username = item.utente.username;
        tmp.tipologia = item.utente.tipologia.tipologia;
      } else { tmp.username = '-' }

      (item.remoteIP !== null) ? tmp.remoteIP = item.remoteIP : tmp.remoteIP = 'Sconosciuto'

      tmp.webService = item.webService.tipologia;

      myData.push(tmp);
    }
    return myData;
  }

}
