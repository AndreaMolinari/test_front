import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ServizioService } from 'src/app/API/servizio/servizio.service';
import { DatePipe, Location } from '@angular/common';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { FlottaService } from 'src/app/API/flotta/flotta.service';
import * as env from 'src/environments/env';
import { ComponentePipe } from 'src/app/API/PIPES/componente/componente.pipe';
import { InserimentiPipe } from 'src/app/API/PIPES/inserimenti.pipe';
import { FlottaPipe } from 'src/app/API/PIPES/flotta/flotta.pipe';
import { ServizioInFlottaModalComponent } from '../../shared/modals/servizio-in-flotta-modal/servizio-in-flotta-modal.component';
import { ContextModalData, ElencoErroriComponent } from '../../shared/modals/elenco-errori/elenco-errori.component';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

@Component({
  selector: 'app-servizio-aggiungi',
  templateUrl: './servizio-aggiungi.component.html',
  styleUrls: ['./servizio-aggiungi.component.less']
})

export class ServizioAggiungiComponent implements OnInit {
  env = env;

  myForm: FormGroup;

  modifica: boolean;
  duplicato: boolean;
  urlIDAnagrafica;
  urlIDModifica;

  datiModifica: any;

  loadingData: boolean;

  sourceFlotta: LocalDataSource = new LocalDataSource();

  settingFlotta = {
    actions: {
      columnTitle: 'Azioni',
      position: 'right'
    },
    noDataMessage: 'Questo servizio non è in nessuna flotta',
    mode: 'external',
    add: {
      addButtonContent: '<i class="nb-plus"></i>'
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>'
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>'
    },
    columns: {
      id: {
        title: 'ID',
        type: 'text',
        filter: false
      },
      nome: {
        title: 'Flotta',
        filter: false,
        valuePrepareFunction: cell => {
          if (cell == null || cell === '') {
            return '--';
          } else {
            return cell;
          }
        }
      },
      nicknameServizio: {
        title: 'Nickname Servizio',
        filter: false,
        valuePrepareFunction: cell => {
          if (cell == null || cell === '') {
            return '--';
          } else {
            return cell;
          }
        }
      },
      nServizi: {
        title: 'Numero servizi',
        filter: false,
        type: 'text',
        width: '0'
      },
      utente: {
        title: 'Username',
        type: 'text',
        filter: false
      }
    }
  };

  showFooter = true;

  modRadiocomando: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private fb: FormBuilder,
    public apiServizio: ServizioService,
    private flottaService: FlottaService,
    private flottaPipe: FlottaPipe,
    private datePipe: DatePipe,
    private componentePipe: ComponentePipe,
    private toastrService: NbToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private inserimentiPipe: InserimentiPipe,
    private dialogService: NbDialogService,
    private flottaApi: FlottaService,
  ) {
    this.urlIDModifica = activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      servizioInstallatore: this.fb.array([]),
      note: this.fb.array([]),
      servizio: this.fb.array([]),
      mezzo: this.fb.array([]),
      componente: this.fb.array([]),
      radiocomando: this.fb.array([]),
      tacho: this.fb.array([])
    });
    this.onEdit();
    this.onDuplicated();
    this.urlIDAnagrafica = this.activatedRoute.snapshot.paramMap.get('idAnagrafica');

    if (env.rivenditore) {
      if (this.modifica) {
        this.showFooter = false;
      }
    }


    this.myForm.valueChanges.subscribe(changes => {
      if (Array.isArray(changes.radiocomando) && changes.radiocomando.length > 0) {
        this.modRadiocomando.next(true);
      }
    });
  }

  addFormGroup(name: string, form: FormArray): void {
    this.myForm.setControl(name, form);
  }

  goBack(): void {
    this.location.back();
  }

  onEdit(): void {
    const urlID = this.activatedRoute.snapshot.paramMap.get('id');
    if (urlID) {
      this.modifica = true;
      this.apiServizio.filterByID(urlID);
      this.loadFlottaTable(urlID);
    }
    this.apiServizio.modificaDati.subscribe(data => {
      this.datiModifica = data;
    });
  }

  onDuplicated() {
    const urlID = this.activatedRoute.snapshot.paramMap.get('idOrigine');
    if (urlID) {
      this.duplicato = true;
      this.apiServizio.filterByID(urlID);
    }
  }

  onSubmit(): void {
    this.loadingData = true;

    this.myForm.value.servizio[0].dataInizio = this.datePipe.transform(this.myForm.value.servizio[0].dataInizio, 'yyyy-MM-dd', '+2');
    this.myForm.value.servizio[0].dataFine = (this.myForm.value.servizio[0].dataFine == null) ?
      '' :
      this.datePipe.transform(this.myForm.value.servizio[0].dataFine, 'yyyy-MM-dd', '+2');

    this.myForm.value.servizio[0].dataSospInizio = (!this.myForm.value.servizio[0].dataSospInizio) ?
      this.myForm.value.servizio[0].dataSospInizio :
      this.datePipe.transform(this.myForm.value.servizio[0].dataSospInizio, 'yyyy-MM-dd', '+2');

    this.myForm.value.servizio[0].dataSospFine = (!this.myForm.value.servizio[0].dataSospFine) ?
      this.myForm.value.servizio[0].dataSospFine :
      this.datePipe.transform(this.myForm.value.servizio[0].dataSospFine, 'yyyy-MM-dd', '+2');

    this.myForm.value.servizioInstallatore[0].dataInstallazione = this.datePipe.transform(
      this.myForm.value.servizioInstallatore[0].dataInstallazione, 'yyyy-MM-dd', '+2');

    this.myForm.value.componente = this.componentePipe.transformCheckbox(this.myForm.value.componente, false);

    // ? Formatto il form per adattarlo alle API
    const params = (this.modifica)
      ? this.inserimentiPipe.modificaServizio(JSON.parse(JSON.stringify(this.myForm.value)))
      : this.inserimentiPipe.servizio(JSON.parse(JSON.stringify(this.myForm.value)), this.myForm);

    // ? Qua faccio il submit
    if (this.modifica === true) {
      this.apiServizio.putServizio(params).subscribe(
        resp => {
          this.toastrService.success('ID servizio: ' + resp.id, 'Servizio modificato correttamente!');
          this.loadingData = false;
          if (this.urlIDAnagrafica) {
            this.router.navigate(['/pages/servizio/lista/' + this.urlIDAnagrafica]);
          } else { this.router.navigate(['/pages/servizio/lista/']); }
        }, error => {
          this.loadingData = false;
          this.toastrService.danger(error, 'Servizio NON modificato!');

          if (error.status === 422 && error.error.errors) {
            const dataToModal: ContextModalData = {
              operazione: 'modifica',
              origine: 'servizio',
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

        });
    } else {
      this.apiServizio.addServizio(params).subscribe(
        resp => {
          this.toastrService.success('ID servizio: ' + resp.id, 'Servizio aggiunto correttamente!');
          this.loadingData = false;

          if (this.urlIDAnagrafica !== undefined && this.urlIDAnagrafica !== null) {
            this.router.navigate(['/pages/servizio/lista/' + this.urlIDAnagrafica]);
          } else { this.router.navigate(['/pages/servizio/lista/']); }
        }, error => {
          this.loadingData = false;
          this.toastrService.danger(error, 'Servizio NON aggiunto correttamente!');

          if (error.status === 422 && error.error.errors) {
            const dataToModal: ContextModalData = {
              operazione: 'creazione',
              origine: 'servizio',
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
        });
    }
  }

  onSubmitPlusFlotta(): void {
    this.loadingData = true;
    // ? Formatto il form per adattarlo alle API
    this.myForm.value.servizio[0].dataInizio = this.datePipe.transform(this.myForm.value.servizio[0].dataInizio, 'yyyy-MM-dd', '+2');
    this.myForm.value.servizio[0].dataFine = (this.myForm.value.servizio[0].dataFine == null) ?
      '' :
      this.datePipe.transform(this.myForm.value.servizio[0].dataFine, 'yyyy-MM-dd', '+2');

    this.myForm.value.servizio[0].dataSospInizio = (!this.myForm.value.servizio[0].dataSospInizio) ?
      this.myForm.value.servizio[0].dataSospInizio :
      this.datePipe.transform(this.myForm.value.servizio[0].dataSospInizio, 'yyyy-MM-dd', '+2');

    this.myForm.value.servizio[0].dataSospFine = (!this.myForm.value.servizio[0].dataSospFine) ?
      this.myForm.value.servizio[0].dataSospFine :
      this.datePipe.transform(this.myForm.value.servizio[0].dataSospFine, 'yyyy-MM-dd', '+2');

    this.myForm.value.servizioInstallatore[0].dataInstallazione = this.datePipe.transform(
      this.myForm.value.servizioInstallatore[0].dataInstallazione, 'yyyy-MM-dd', '+2');

    this.myForm.value.componente = this.componentePipe.transformCheckbox(this.myForm.value.componente, false);

    const params = (this.modifica)
      ? this.inserimentiPipe.modificaServizio(JSON.parse(JSON.stringify(this.myForm.value)))
      : this.inserimentiPipe.servizio(JSON.parse(JSON.stringify(this.myForm.value)), this.myForm);

    if (this.modifica === true) {
      this.apiServizio.putServizio(params).subscribe(
        resp => {
          this.toastrService.success('ID servizio: ' + resp.id, 'Servizio modificato correttamente!');
          this.loadingData = false;
          if (this.urlIDAnagrafica) {
            this.router.navigate(['/pages/servizio/lista/' + this.urlIDAnagrafica]);
          } else { this.router.navigate(['/pages/servizio/lista/']); }
        }, error => {
          this.loadingData = false;
          this.toastrService.danger(error, 'Servizio NON modificato!');

          if (error.status === 422 && error.error.errors) {
            const dataToModal: ContextModalData = {
              operazione: 'modifica',
              origine: 'servizio',
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

        });
    } else {
      this.apiServizio.addServizio(params).subscribe(
        resp => {
          this.toastrService.success('ID servizio: ' + resp.id, 'Servizio aggiunto correttamente!');

          this.loadingData = false;

          this.dialogService.open(ServizioInFlottaModalComponent, { context: { data: resp.id } })
            .onClose.subscribe(data => {
              if (data === false) {
                
              } else if (data) {
                if (this.urlIDAnagrafica) {
                  this.router.navigate(['/pages/servizio/lista/' + this.urlIDAnagrafica]);
                } else { this.router.navigate(['/pages/servizio/lista/']); }
              } else {
                this.toastrService.warning('Il servizio non è stato aggiunto a nessuna flotta!', 'AGGIUNTA A FLOTTA ANNULLATA');
                if (this.urlIDAnagrafica) {
                  this.router.navigate(['/pages/servizio/lista/' + this.urlIDAnagrafica]);
                } else { this.router.navigate(['/pages/servizio/lista/']); }
              }
            });
        }, error => {
          this.loadingData = false;
          this.toastrService.danger(error, 'Servizio NON aggiunto correttamente!');

          if (error.status === 422 && error.error.errors) {
            const dataToModal: ContextModalData = {
              operazione: 'creazione',
              origine: 'servizio',
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
        });
    }
  }

  onReset(): void {
    if (this.modifica === true) {
      this.onEdit();
    } else {
      this.myForm.reset();
    }
  }

  loadFlottaTable(idFlotta): void {
    this.flottaService.servizioFlotta(idFlotta).subscribe(data => {
      this.sourceFlotta.load(this.flottaPipe.transformXServizio(data));
    });
  }

  onCreateFlotta($event): void {
    this.dialogService.open(ServizioInFlottaModalComponent, { context: { data: this.urlIDModifica } })
      .onClose.subscribe(submitData => {
        if (typeof (submitData) === 'boolean' && submitData === true) {
          this.loadFlottaTable(this.urlIDModifica);
        }
      });
  }

  onEditFlotta($event): void {
    this.router.navigate(['/pages/flotta/modifica/' + $event.data.id]);
  }

  onDeleteFlotta($event) {
    this.flottaApi.deleteServizioFromFlotta($event.data.id, this.urlIDModifica).subscribe({
      next: () => {
        this.toastrService.success('Il servizio è stato rimosso dalla flotta', 'Operazione Completata');
        this.loadFlottaTable(this.urlIDModifica);
      },
      error: (error) => {
        this.toastrService.danger(error, 'Operazione NON Completata');
      }
    });
  }

}
