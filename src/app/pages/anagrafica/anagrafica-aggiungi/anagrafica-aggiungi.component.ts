import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AnagraficaService } from 'src/app/API/anagrafica/anagrafica.service';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { FatturazioneInserimentoPipe } from 'src/app/API/PIPES/fatturazione/fatturazione-inserimento.pipe';
import { IndirizzoCreaPipe } from 'src/app/API/PIPES/indirizzo/indirizzo-crea.pipe';
import { UtentePipe } from 'src/app/API/PIPES/utente/utente.pipe';
import { LocalDataSource } from 'ng2-smart-table';
import { AnagraficaPipe } from 'src/app/API/PIPES/anagrafica/anagrafica.pipe';
import { InserimentiPipe } from 'src/app/API/PIPES/inserimenti.pipe';
import * as env from 'src/environments/env';
import { ContextModalData, ElencoErroriComponent } from '../../shared/modals/elenco-errori/elenco-errori.component';

@Component({
  selector: 'app-anagrafica-aggiungi',
  templateUrl: './anagrafica-aggiungi.component.html',
  styleUrls: ['./anagrafica-aggiungi.component.less']
})

export class AnagraficaAggiungiComponent implements OnInit {

  env = env;

  myForm: FormGroup;

  anagraficaRelazione: any = null;

  sourceSottoAnagrafiche: LocalDataSource = new LocalDataSource();
  settingsSottoAnagrafiche = {
    actions: {
      columnTitle: 'Azioni',
      position: 'right',
      add: false
    },
    mode: 'external',
    edit: {
      title: 'Modifica anagrafica',
      editButtonContent: '<i class="nb-edit" title="Modifica"></i>'
    },
    delete: {
      title: 'Rimuovi realazione di SottoAnagrafica',
      deleteButtonContent: '<i class="nb-trash" title="Rimuvo relazione di SottoAnagrafica"></i>'
    },
    columns: {
      id: {
        title: 'ID',
        compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1,
      },
      nome: {
        title: 'Nome / RagSoc',
        type: 'text'
      },
      codFisc: {
        title: 'CodFisc / pIva',
        type: 'text'
      },
      nServizi: {
        title: 'Servizi',
        type: 'text'
      },
      relazione: {
        title: 'Relazione',
        type: 'text'
      }
    },
  };

  sourceAutisti: LocalDataSource = new LocalDataSource();
  settingsAutisti = {
    actions: {
      columnTitle: 'Azioni',
      position: 'right',
      add: false,
      edit: false,
      delete: false
    },
    columns: {
      id: {
        title: 'ID',
        compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1,
      },
      nome: {
        title: 'Nome / RagSoc',
        type: 'text'
      },
      codFisc: {
        title: 'CodFisc / pIva',
        type: 'text'
      }
    },
  };

  modifica = false;
  cardAccent = 'success';
  statoAnagrafica = {
    color: '',
    stato: '',
  };
  urlModifica;

  hasChildren = null;
  hasAutisti = null;
  isAutista = false;

  loadingData: boolean;

  btnClass = ' col-4 text-right btnServizi';

  constructor(
    private fb: FormBuilder,
    public apiAnagrafica: AnagraficaService,
    private anagraficaPipe: AnagraficaPipe,
    private activatedRoute: ActivatedRoute,
    public datePipe: DatePipe,
    private fatturazioneCreaPipe: FatturazioneInserimentoPipe,
    private indirizzoCreaPipe: IndirizzoCreaPipe,
    private utentePipe: UtentePipe,
    private router: Router,
    private toastrService: NbToastrService,
    private location: Location,
    private inserimentoPipe: InserimentiPipe,
    private dialogService: NbDialogService
  ) {
    this.urlModifica = activatedRoute.snapshot.paramMap.get('id');

    this.router.routeReuseStrategy.shouldReuseRoute = (() => {
      return false;
    });

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
      }
    });
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      anagrafica: this.fb.array([]),
      indirizzo: this.fb.array([]),
      fatturazione: this.fb.array([]),

      utente: this.fb.array([]),
      rubrica: this.fb.array([]),
      relazioni: this.fb.array([]),
      nota: this.fb.array([])
    });
    this.isChildrenCheck();
    this.onEdit();

    this.myForm.get('anagrafica').valueChanges.subscribe(data => {
      this.myForm.get('anagrafica').value[0].idTipologia.some(element => {
        if (element === 16) {
          this.isAutista = true;
          return true;
        } else {
          this.isAutista = false;
        }
      });
      this.myForm.addControl('documento', this.fb.array([]));
      this.myForm.addControl('componente', this.fb.array([]));
    });

    this.myForm.get('relazioni').valueChanges.subscribe(value => {
      this.anagraficaRelazione = (value.length > 0) ? this.anagraficaRelazione : null;
    });
  }

  addFormGroup(name: string, form: FormArray) {
    this.myForm.setControl(name, form);
  }

  goBack() {
    this.location.back();
  }

  listaServizi() {
    const urlID = this.activatedRoute.snapshot.paramMap.get('id');
    this.router.navigate(['/pages/servizio/lista/' + urlID]);
  }

  hasParent(resp) {
    if (resp.parents !== null && resp.parents[0] !== undefined) {
      this.anagraficaRelazione = true;
      setTimeout(() => this.apiAnagrafica.loadAnagraficaRelazione(resp.parents));
    }
  }

  hasChildrenCheck(resp) {
    if (resp.children !== null && resp.children.length > 0) {
      this.hasChildren = resp.children.length;
      this.sourceSottoAnagrafiche.load(this.anagraficaPipe.transformListaSottoAnagrafica(resp.children));
    }
  }

  isChildrenCheck() {
    this.anagraficaRelazione = this.activatedRoute.snapshot.paramMap.get('idRela');
  }

  // ! MI MANCA LA LOGICA PER GLI AUTISTI
  hasAutistiCheck(resp) {
    console.error('Non conosco la logica per la lista autisti');
    // this.sourceAutisti.load(resp.autisti)
  }

  onEdit() {
    const urlID = this.activatedRoute.snapshot.paramMap.get('id');
    if (urlID !== null) {
      this.cardAccent = 'warning';
      this.modifica = true;
      this.apiAnagrafica.filterByID(urlID);
      this.apiAnagrafica.modificaDati.subscribe(resp => {
        this.hasParent(resp);
        this.hasChildrenCheck(resp);

        if (resp.bloccato === true) {
          this.statoAnagrafica = { color: 'danger', stato: 'Bloccato' };
        } else {
          this.statoAnagrafica = { color: 'success', stato: 'Attiva' };
        }
      });
    } else {
      this.btnClass = 'col-4 text-right btnServiziHide';
    }
  }

  onSubmit(): void {
    this.loadingData = true;
    // ? Transformo i dati X le API
    const formClone = JSON.parse(JSON.stringify(this.myForm.value));
    formClone.anagrafica[0].dataNascita = this.datePipe.transform(formClone.anagrafica[0].dataNascita, 'yyyy-MM-dd');
    formClone.fatturazione = this.fatturazioneCreaPipe.transform(formClone.fatturazione, false);
    formClone.indirizzo = this.indirizzoCreaPipe.transform(formClone.indirizzo, false);
    formClone.utente = this.utentePipe.transformInserimento(formClone.utente, false);

    let params: any = null;
    if (this.modifica) {
      params = this.inserimentoPipe.modificaAnagrafica(formClone);
    } else {
      params = this.inserimentoPipe.anagrafica(formClone, this.myForm);
    }

    let serviceQuery;
    if (this.isAutista === true) { params.documento[0].file = this.castDataFile(params.documento[0].file); }

    if (this.modifica === true) {
      serviceQuery = this.apiAnagrafica.putAnagrafica(params);
    } else {
      serviceQuery = this.apiAnagrafica.addAnagrafica(params);
    }

    serviceQuery.subscribe(
      resp => {
        this.loadingData = false;
        this.toastrService.success('ID Anagrafica: ' + resp.id,
          (this.modifica) ? 'Anagrafica modificata correttamente!' : 'Anagrafica aggiunta correttamente!');

        this.router.navigate(['/pages/anagrafica/modifica/' + resp.id]);
        document.body.scrollTop = 0;
        document.querySelector('body').scrollTo(0, 0);
      }, error => {
        this.loadingData = false;
        this.toastrService.danger(error, 'Anagrafica NON aggiunta!');

        if (error.status === 422 && error.error.errors) {
          const dataToModal: ContextModalData = {
            operazione: (this.modifica) ? 'modifica' : 'creazione',
            origine: 'anagrafica',
            errorsList: []
          };

          Object.keys(error.error.errors).forEach(key => {
            if (Array.isArray(error.error.errors)) {
              error.error.errors[key].forEach(errore => {
                dataToModal.errorsList.push({ icona: 'warning', titolo: key, motivo: errore });
              });
            } else {
              dataToModal.errorsList.push({ icona: 'warning', titolo: key, motivo: error.error.errors[key][0] });
            }
          });

          this.dialogService.open(ElencoErroriComponent, { context: { contextData: dataToModal } });
        }
      }
    );
  }

  castDataFile(formValue): FormData {
    const formData = new FormData();
    for (const key of Object.keys(formValue)) {
      const value = formValue[key];
      formData.append(key, value);
    }
    return formData;
  }

  onReset() {
    if (this.modifica === true) {
      this.onEdit();
    } else {
      this.myForm.reset();
    }
  }

  onEditSottoAnagrafica($event) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/pages/anagrafica/modifica/' + $event.data.id]);
  }

  onDeleteSottoAnagrafica($event) {
    this.apiAnagrafica.deleteRelazioneAnagrafica($event.data.id).subscribe(data => {
      this.toastrService.success('Relazione con ' + $event.data.nome + ' eliminato con successo', 'Fatto!');
    }, error => {
      this.toastrService.danger('Impossibile eliminare la realzione con ' + $event.data.nome, 'Errore server!');
      console.error(error);
    });
  }

}
