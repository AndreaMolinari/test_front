import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { FlottaPipe } from 'src/app/API/PIPES/flotta/flotta.pipe';
import { UtentePipe } from 'src/app/API/PIPES/utente/utente.pipe';
import { ServizioPipe } from 'src/app/API/PIPES/servizio/servizio.pipe';
import { NbDialogService, NbToastrService, NbDateService } from '@nebular/theme';
import { UtenteModalComponent } from '../../modals/utente-modal/utente-modal.component';
import { ListaCheckboxFlottaComponent } from '../../ng-smart-table-customs/lista-checkbox-flotta/lista-checkbox-flotta.component';
import { DatePipe } from '@angular/common';
import { FlottaService } from 'src/app/API/flotta/flotta.service';
import { icons } from 'src/assets/fonts/icons';
import * as env from 'src/environments/env';
import { ActivatedRoute } from '@angular/router';
import { ServizioService } from 'src/app/API/servizio/servizio.service';
import { NewServizioModalComponent } from '../../modals/new-servizio-modal/new-servizio-modal.component';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shared-flotta-crea',
  templateUrl: './flotta-crea.component.html',
  styleUrls: ['./flotta-crea.component.less']
})

export class FlottaCreaComponent implements OnInit, OnDestroy {
  env = environment;
  isRivenditore = env.rivenditore;

  @Output() outForm = new EventEmitter<FormArray>();
  @Input() parentForm: FormArray;
  @Input() max = 99;
  @Input() modifica: boolean;
  @Input() dataInstance: any;

  questoForm: FormGroup;

  icons = icons;

  settingsServizio = (this.isRivenditore) ?
    {
      actions: false,
      noDataMessage: 'Nessun servizio collegato alla flotta',
      columns: {
        idServizio: {
          title: 'ID',
          type: 'text',
          editable: false,
          compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1,
          width: '0'
        },
        dataInizio: {
          title: 'Data attivazione',
          type: 'text',
          editable: false,
          filter: false,
          valuePrepareFunction: (cell, row) => {
            if (cell == null) {
              return '--';
            } else {
              try {
                return this.datePipe.transform(cell, 'dd/MM/yyyy');
              } catch (error) {
                console.error('SI E VERIFICATO UN PROBLEMA CON UNA DATA NELLA TABELLA.... recupero');
                return cell;
              }
            }
          }
        },
        dataFine: {
          title: 'Data disattivazione',
          type: 'text',
          editable: false,
          filter: false,
          valuePrepareFunction: (cell, row) => {
            if (cell == null) {
              return '--';
            } else {
              try {
                return this.datePipe.transform(cell, 'dd/MM/yyyy');
              } catch (error) {
                console.error('SI E VERIFICATO UN PROBLEMA CON UNA DATA NELLA TABELLA.... recupero');
                return cell;
              }
            }
          }
        },
        mezzo: {
          title: 'Targa / Telaio',
          type: 'text',
          editable: false
        },
        componente: {
          title: 'Unitcode',
          type: 'text',
          editable: false,
        },
        nickname: {
          title: 'Nickname Mezzo',
          type: 'text'
        },
        icona: {
          title: 'Icona Mezzo',
          type: 'html',
          filter: false,
          sort: false,
          class: 'cane',
          editor: {
            type: 'list',
            config: {
              list: icons
            }
          },
          valuePrepareFunction: (cell, row) => {
            if (cell == null || cell === '&#xe908;') {
              return '(&#xe908;)';
            } else {
              return cell;
            }
          }
        },
      },
    }
    :
    {
      actions: {
        columnTitle: 'Azioni',
        position: 'right',
        add: false
      },
      noDataMessage: 'Nessun servizio collegato alla flotta',
      mode: 'inline',
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmSave: true,
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
      columns: {
        idServizio: {
          title: 'ID',
          type: 'text',
          editable: false,
          compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1,
          width: '0'
        },
        dataInizio: {
          title: 'Data attivazione',
          type: 'text',
          editable: false,
          filter: false,
          valuePrepareFunction: (cell) => {
            if (cell == null) {
              return '--';
            } else {
              try {
                return this.datePipe.transform(cell, 'dd/MM/yyyy');
              } catch (error) {
                console.error('SI E VERIFICATO UN PROBLEMA CON UNA DATA NELLA TABELLA.... recupero');
                return cell;
              }
            }
          }
        },
        dataFine: {
          title: 'Data disattivazione',
          type: 'text',
          editable: false,
          filter: false,
          valuePrepareFunction: (cell) => {
            if (cell == null) {
              return '--';
            } else {
              try {
                return this.datePipe.transform(cell, 'dd/MM/yyyy');
              } catch (error) {
                console.error('SI E VERIFICATO UN PROBLEMA CON UNA DATA NELLA TABELLA.... recupero');
                return cell;
              }
            }
          }
        },
        mezzo: {
          title: 'Targa / Telaio',
          type: 'text',
          editable: false
        },
        componente: {
          title: 'Unitcode',
          type: 'text',
          editable: false,
        },
        nickname: {
          title: 'Nickname Mezzo',
          type: 'text'
        },
        icona: {
          title: 'Icona Mezzo',
          type: 'html',
          filter: false,
          sort: false,
          class: 'cane',
          editor: {
            type: 'list',
            config: {
              list: icons
            }
          },
          valuePrepareFunction: (cell, row) => {
            if (cell == null || cell === '&#xe908;') {
              return '(&#xe908;)';
            } else {
              return cell;
            }
          }
        },
      },
    };
  sourceServizio: LocalDataSource = new LocalDataSource();

  settingsUtente = (this.isRivenditore) ?
    {
      actions: false,
      pager: {
        perPage: 2
      },
      noDataMessage: 'Nessun utente collegato alla flotta',
      hideSubHeader: true,
      columns: {
        idUtente: {
          title: 'ID',
          type: 'text',
          editable: false,
          filter: false,
          compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1,
          width: '0'
        },
        username: {
          title: 'Username',
          type: 'text',
          editable: false,
          filter: false
        },
        nickname: {
          title: 'Nickname Flotta',
          type: 'text',
          filter: false
        },
        principale: {
          title: 'Flotta principale',
          type: 'custom',
          valuePrepareFunction: (cell, row) => row,
          renderComponent: ListaCheckboxFlottaComponent,
          filter: false,
          editor: {
            type: 'checkbox',
            config: {
              true: '1',
              false: '0'
            }
          }
        }
      },
    }
    :
    {
      actions: {
        columnTitle: 'Azioni',
        position: 'right',
        add: false
      },
      pager: {
        perPage: 2
      },
      noDataMessage: 'Nessun utente collegato alla flotta',
      hideSubHeader: true,
      mode: 'inline',
      edit: {
        editButtonContent: '<i class="nb-edit"></i>',
        saveButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmSave: true,
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>',
        confirmDelete: true,
      },
      columns: {
        idUtente: {
          title: 'ID',
          type: 'text',
          editable: false,
          filter: false,
          compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1,
          width: '0'
        },
        username: {
          title: 'Username',
          type: 'text',
          editable: false,
          filter: false
        },
        nickname: {
          title: 'Nickname Flotta',
          type: 'text',
          filter: false
        },
        principale: {
          title: 'Flotta principale',
          type: 'custom',
          valuePrepareFunction: (cell, row) => row,
          renderComponent: ListaCheckboxFlottaComponent,
          filter: false,
          editor: {
            type: 'checkbox',
            config: {
              true: '1',
              false: '0'
            }
          }
        }
      },
    };
  sourceUtente: LocalDataSource = new LocalDataSource();

  servizio;
  utente;
  now = this.datePipe.transform(this.dateService.today().toString(), 'yyyy-MM-dd');

  // ? RUNTIME VARIABLES
  UNonEdit: Subscription;
  ModalDataIdFlotta: Subscription;

  constructor(
    private fb: FormBuilder,
    private servizioService: ServizioService,
    private servizioPipe: ServizioPipe,
    private utentePipe: UtentePipe,
    private flottaPipe: FlottaPipe,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private flottaService: FlottaService,
    private dateService: NbDateService<Date>,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute
  ) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.settingsServizio['rowClassFunction'] = (row) => {
      if (row.data.dataFine !== '-' && row.data.dataFine < this.now) {
        return 'danger';
      }
      return '';
    };

    const idServizio = this.activatedRoute.snapshot.paramMap.get('idServizio');
    if (idServizio !== null) {
      this.servizioService.filterByIDOBE(idServizio).subscribe(resp => {

        const formArray = this.parentForm.at(0).get('servizio') as FormArray;

        if (formArray.value.filter(option => option.idServizio === resp.id).length === 0) {
          formArray.push(this.fb.control(this.servizioPipe.transformInserimentoTableSPECIAL(resp)));
          this.toastrService.info('', 'Ricorda di salvare le modifiche con il tasto "Salva Flotta"',
            { duration: 10000, icon: 'alert-circle', preventDuplicates: true });
        } else {
          this.toastrService.danger('Il servizio inserito è gia in flotta!', 'Errore',
            { duration: 5000, icon: 'alert-circle', preventDuplicates: false });
        }
        this.sourceServizio.load(this.flottaPipe.transformListaServizi(formArray.value));

      });

    }

    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();

    if (this.modifica === true) {
      this.onEdit(this.dataInstance);
    }
  }

  getServices(data): void {
    const formArray = this.parentForm.at(0).get('servizio') as FormArray;
    formArray.clear();
    for (let x = 0; formArray.length < data.servizio.length; x++) {
      formArray.push(new FormControl(data.servizio[x]));
    }
    this.sourceServizio.load(this.flottaPipe.transformListaServizi(formArray.value));
  }

  getUtenti(data): void {
    const formArray = this.parentForm.at(0).get('utente') as FormArray;
    formArray.clear();
    for (let x = 0; formArray.length < data.utente.length; x++) {
      formArray.push(new FormControl(data.utente[x]));
    }
    this.sourceUtente.load(this.flottaPipe.transformListaUtenti(formArray.value));
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      this.outForm.emit(this.parentForm);
    } else {
      alert('Non puoi aggiungere più di ' + this.max + ' flotte');
    }
  }

  crea(): FormGroup {
    if (this.modifica === true) {
      return this.fb.group({
        id: [],
        nome: ['', Validators.required],
        descrizione: [''],
        utente: this.fb.array([], Validators.required),
        servizio: this.fb.array([], Validators.required),
        defaultIcon: [Validators.required]
      });
    } else {
      return this.fb.group({
        nome: ['', Validators.required],
        descrizione: [''],
        utente: this.fb.array([], Validators.required),
        servizio: this.fb.array([], Validators.required),
        defaultIcon: ['&#xe908;', Validators.required]
      });
    }
  }

  onEdit(data): void {
    this.UNonEdit = data.modificaDati.subscribe(resp => {
      resp = resp[0];
      this.getServices(resp);
      this.getUtenti(resp);
      this.parentForm.at(0).get('id').patchValue(resp.id);
      this.parentForm.at(0).get('nome').patchValue(resp.nome);
      this.parentForm.at(0).get('descrizione').patchValue(resp.descrizione);
      this.parentForm.at(0).get('defaultIcon').patchValue(resp.defaultIcon);
    });
  }

  remove(i: number): void {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
  }

  onCreateUtente(): void {
    this.dialogService.open(UtenteModalComponent, {
      hasScroll: true,
      context: { idFlotta: (this.parentForm.at(0).get('id')) ? this.parentForm.at(0).get('id').value : null }
    })
      .onClose.subscribe(data => {
        if (data) {
          const formArray = this.parentForm.at(0).get('utente') as FormArray;
          const nickFlotta = this.parentForm.at(0).get('nome').value;

          data.forEach(element => {

            if (formArray.value.filter(option => option.idUtente === element.idUtente).length === 0) {
              formArray.push(this.fb.control(this.utentePipe.transformInserimentoTable(element, nickFlotta)));
              this.toastrService.info('', 'Ricorda di salvare le modifiche con il tasto "Salva Flotta"',
                { duration: 10000, icon: 'alert-circle', preventDuplicates: true });
            } else {
              this.toastrService.danger(`L'utente inserito è gia collegato a questa flotta!`, 'Errore',
                { duration: 5000, icon: 'alert-circle', preventDuplicates: false });
            }

          });
          this.sourceUtente.load(formArray.value);
        }

      });
  }

  onEditUtente($event): void {
    const formArray = this.parentForm.at(0).get('utente') as FormArray;
    const index = formArray.value.findIndex(x => x.idUtente === $event.data.idUtente);
    formArray.at(index).setValue($event.newData);
    $event.confirm.resolve();
  }

  onDeleteUtente($event): void {
    this.sourceUtente.remove($event.data);
    const formArray = this.parentForm.at(0).get('utente') as FormArray;
    const index = formArray.value.findIndex(x => x.idUtente === $event.data.idUtente);
    if (index === -1) {
      this.toastrService.danger('Qualcosa è andato storto nella cancellazione del utente', 'ERRORE');
      console.error('index è -1');
    } else {
      formArray.removeAt(index);
    }
  }

  onCreateServizio(): void {
    this.dialogService.open(NewServizioModalComponent, {
      hasScroll: true,
      context: { idFlotta: (this.parentForm.at(0).get('id')) ? this.parentForm.at(0).get('id').value : null }
    })
      .onClose.subscribe(data => {

        if (data) {
          const formArray = this.parentForm.at(0).get('servizio') as FormArray;

          data.forEach(servizio => {

            if (formArray.value.filter(option => option.idServizio === servizio.idServizio).length === 0) {
              formArray.push(this.fb.control(this.servizioPipe.transformInserimentoTable(servizio)));
              this.toastrService.info('', 'Ricorda di salvare le modifiche con il tasto "Salva Flotta"',
                { duration: 10000, icon: 'alert-circle', preventDuplicates: true });
            } else {
              this.toastrService.danger('Il servizio inserito è gia in flotta!', 'Errore',
                { duration: 5000, icon: 'alert-circle', preventDuplicates: false });
            }

          });
          this.sourceServizio.load(this.flottaPipe.transformListaServizi(formArray.value));
        }
      });
  }

  onEditServizio($event): void {
    const formArray = this.parentForm.at(0).get('servizio') as FormArray;
    const index = formArray.value.findIndex(x => x.idServizio === $event.data.idServizio);
    formArray.at(index).setValue($event.newData);
    $event.confirm.resolve();
  }

  onDeleteServizio($event): void {
    this.sourceServizio.remove($event.data);
    const formArray = this.parentForm.at(0).get('servizio') as FormArray;
    const index = formArray.value.findIndex(x => x.idServizio == $event.data.idServizio);
    if (index === -1) {
      this.toastrService.danger('Qualcosa è andato storto nella cancellazione del servizio', 'ERRORE');
      console.error('index è -1');
    } else {
      formArray.removeAt(index);
    }
  }

  ngOnDestroy(): void {
    if (this.UNonEdit) {
      this.UNonEdit.unsubscribe();
    }
    if (this.ModalDataIdFlotta) {
      delete this.ModalDataIdFlotta;
    }
  }

}
