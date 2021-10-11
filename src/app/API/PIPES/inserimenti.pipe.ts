import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inserimenti'
})
export class InserimentiPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

  servizio(value: any, myForm?): any {
    let tmp = value;

    tmp = value.servizio[0];
    tmp.mezzo = (myForm.get('mezzo').touched) ? ((value.mezzo[0].idMezzo) ? value.mezzo : null) : null;
    tmp.componente = (myForm.get('componente').touched) ? ((value.componente[0].idComponente) ? value.componente : null) : null;
    tmp.tacho = (myForm.get('tacho').touched) ? ((value.tacho[0].idComponente) ? value.tacho : null) : null;
    tmp.nota = (myForm.get('note').touched) ? ((value.note[0].testo) ? value.note : null) : null;
    tmp.servizioInstallatore = (value.servizioInstallatore[0].idAnagrafica) ? value.servizioInstallatore : null;
    // tmp.sim = (myForm.get('sim').touched) ? ( (value.sim[0].idSim) ? value.sim : null ) : null;
    tmp.sim = null;

    // tmp.radiocomando = (myForm.get('radiocomando').touched) ? ((value.radiocomando[0].idRadiocomando) ? value.radiocomando : null) : null;

    tmp.radiocomando = [];
    value.radiocomando.forEach(radiocomando => {
      if (radiocomando.idRadiocomando !== null) {
        tmp.radiocomando.push(radiocomando);
      } else {
        console.warn('Cancello un radiocomando...');
      }
    });

    value.servizio[0].applicativo.forEach((applicativo, x) => {
      tmp.applicativo[x] = { idApplicativo: applicativo };
    });

    if (tmp.servizioInstallatore !== null) {
      tmp.servizioInstallatore.forEach(anagrafica => {
        delete anagrafica.autocomplete;
      });
    }

    if (tmp.componente !== null) {
      tmp.componente.forEach(componente => {
        delete componente.autocomplete;
        delete componente.restituzione;
      });
    }

    if (tmp.tacho !== null) {
      tmp.tacho.forEach(tacho => {
        delete tacho.autocomplete;
        delete tacho.restituzione;
      });
    }

    if (tmp.mezzo !== null) {
      tmp.mezzo.forEach(mezzo => {
        delete mezzo.autocomplete;
      });
    }

    // delete tmp.autocomplete;

    return tmp;
  }

  modificaServizio(value: any): any {
    let tmp = value;

    tmp = value.servizio[0];

    tmp.mezzo = [];
    value.mezzo.forEach(mezzo => {
      if (mezzo.idMezzo !== null) {
        tmp.mezzo.push(mezzo);
      } else {
        console.warn('Cancello un mezzo...');
      }
    });
    tmp.mezzo = (tmp.mezzo.length === 0) ? null : tmp.mezzo;

    tmp.componente = [];
    value.componente.forEach(componente => {
      if (componente.idComponente !== null) {
        tmp.componente.push(componente);
      } else {
        console.warn('Cancello un componente...');
      }
    });
    tmp.componente = (tmp.componente.length === 0) ? null : tmp.componente;

    tmp.tacho = [];
    value.tacho.forEach(tacho => {
      if (tacho.idComponente !== null) {
        tmp.tacho.push(tacho);
      } else {
        console.warn('Cancello un tacho...');
      }
    });
    tmp.tacho = (tmp.tacho.length === 0) ? null : tmp.tacho;

    tmp.nota = [];
    value.note.forEach(nota => {
      if (nota.testo !== null) {
        tmp.nota.push(nota);
      } else {
        console.warn('Cancello una nota...');
      }
    });
    tmp.nota = (tmp.nota.length === 0) ? null : tmp.nota;


    tmp.servizioInstallatore = [];
    if (value.servizioInstallatore[0].idAnagrafica) {
      tmp.servizioInstallatore = value.servizioInstallatore;
    } else {
      console.warn('Cancello un installatore...');
    }
    tmp.servizioInstallatore = (tmp.servizioInstallatore.length === 0) ? null : tmp.servizioInstallatore;

    tmp.radiocomando = [];
    value.radiocomando.forEach(radiocomando => {
      if (radiocomando.idRadiocomando !== null) {
        tmp.radiocomando.push(radiocomando);
      } else {
        console.warn('Cancello un radiocomando...');
      }
    });

    tmp.sim = null;

    value.servizio[0].applicativo.forEach((applicativo, x) => {
      tmp.applicativo[x] = { idApplicativo: applicativo };
    });

    if (tmp.servizioInstallatore !== null) {
      tmp.servizioInstallatore.forEach(anagrafica => {
        delete anagrafica.autocomplete;
      });
    }

    if (tmp.componente !== null) {
      tmp.componente.forEach(componente => {
        delete componente.autocomplete;
        delete componente.restituzione;
      });
    }

    if (tmp.tacho !== null) {
      tmp.tacho.forEach(tacho => {
        delete tacho.autocomplete;
        delete tacho.restituzione;
      });
    }

    if (tmp.mezzo !== null) {
      tmp.mezzo.forEach(mezzo => {
        delete mezzo.autocomplete;
      });
    }

    return tmp;
  }




  anagrafica(value: any, myForm?): any {
    let tmp = value;

    tmp = value.anagrafica[0];
    tmp.indirizzo = (myForm.get('indirizzo').touched) ? value.indirizzo : null;
    tmp.fatturazione = (myForm.get('fatturazione').touched) ? value.fatturazione : null;
    tmp.utente = (myForm.get('utente').touched) ? value.utente : null;
    tmp.relazioni = (myForm.get('relazioni').touched) ? value.relazioni : null;
    tmp.nota = (myForm.get('nota').touched) ? value.nota : null;

    if (myForm.get('rubrica').touched) {
      tmp.rubrica = [];
      value.rubrica.forEach((contattoSingolo, i) => {
        if (contattoSingolo.descrizione !== null || contattoSingolo.nome !== null) {
          contattoSingolo.recapito.forEach(element => {
            element.predefinito = (element.predefinito === 'Si') ? 1 : 0;
          });
          tmp.rubrica = value.rubrica;
        } else {
          tmp.rubrica = [];
        }
      });
    } else {
      tmp.rubrica = null;
    }

    if (tmp.utente) {
      tmp.utente = [];
      value.utente.forEach(utente => {
        if (utente.idTipologia !== null && utente.username !== null) {
          tmp.utente.push(utente);
        } else {
          console.log('Cancello un utente...');
        }
      });

      tmp.utente = (tmp.utente.length === 0) ? null : tmp.utente;
    }

    if (tmp.indirizzo) {
      tmp.indirizzo = [];
      value.indirizzo.forEach(indirizzo => {
        if (indirizzo.idTipologia !== null && indirizzo.cap !== null) {
          tmp.indirizzo.push(indirizzo);
        } else {
          console.log('Cancello un indirizzo...');
        }
      });

      tmp.indirizzo = (tmp.indirizzo.length === 0) ? null : tmp.indirizzo;
    }

    if (tmp.nota) {
      tmp.nota = [];
      value.nota.forEach(nota => {
        if (nota.testo !== null) {
          tmp.nota.push(nota);
        }
      });

      tmp.nota = (tmp.nota.length === 0) ? null : tmp.nota;
    }

    tmp.tipologia = [];
    if (value.anagrafica[0].idTipologia) {
      value.anagrafica[0].idTipologia.forEach(element => {
        tmp.tipologia.push({
          idTipologia: element
        });
      });
    }


    if (tmp.idTipologia == 16) {
      tmp.componente = value.componente;
      tmp.documento = value.documento;
    }

    delete tmp.idTipologia;
    return tmp;
  }

  modificaAnagrafica(value: any): any {
    let tmp = value;

    tmp = value.anagrafica[0];

    tmp.indirizzo = [];
    value.indirizzo.forEach(indirizzo => {
      if (indirizzo.idTipologia !== null && indirizzo.cap !== null) {
        tmp.indirizzo.push(indirizzo);
      } else {
        console.log('Cancello un indirizzo...');
      }
    });

    tmp.indirizzo = (tmp.indirizzo.length === 0) ? null : tmp.indirizzo;

    tmp.utente = [];
    value.utente.forEach(utente => {
      if (utente.idTipologia !== null && utente.username !== null) {
        tmp.utente.push(utente);
      } else {
        console.log('Cancello un utente...');
      }
    });

    tmp.utente = (tmp.utente.length === 0) ? null : tmp.utente;

    tmp.nota = [];
    value.nota.forEach(nota => {
      if (nota.testo !== null) {
        tmp.nota.push(nota);
      }
    });

    tmp.nota = (tmp.nota.length === 0) ? null : tmp.nota;

    // tmp.indirizzo = (value.indirizzo.idTipologia !== null && value.indirizzo.idTipologia !== null) ? value.indirizzo : null;
    tmp.fatturazione = (value.fatturazione[0].idModalita !== null) ? value.fatturazione : null;
    // tmp.utente = (value.utente.length !== 0) ? value.utente : null;
    if (value.relazioni[0] !== undefined) {
      tmp.relazioni = (value.relazioni[0].idParent) ? value.relazioni : null;
    } else {
      tmp.relazioni = null;
    }
    // tmp.nota = (value.nota.length !== 0) ? value.nota : null;

    if (value.rubrica.length !== 0) {
      if (value.rubrica.length > 0) {
        tmp.rubrica = [];
        value.rubrica.forEach((contattoSingolo, i) => {
          if (contattoSingolo.descrizione !== null || contattoSingolo.nome !== null) {
            contattoSingolo.recapito.forEach(element => {
              element.predefinito = (element.predefinito === 'Si') ? 1 : 0;
            });
            tmp.rubrica = value.rubrica;
          } else {
            tmp.rubrica = [];
          }
        });
      } else {
        tmp.rubrica = null;
      }
    } else {
      tmp.rubrica = null;
    }


    tmp.tipologia = [];
    if (value.anagrafica[0].idTipologia) {
      value.anagrafica[0].idTipologia.forEach(element => {
        tmp.tipologia.push({
          idTipologia: element
        });
      });
    }


    if (tmp.idTipologia == 16) {
      tmp.componente = value.componente;
      tmp.documento = value.documento;
    }

    delete tmp.idTipologia;

    console.log(value);

    return tmp;
  }

}
