import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { ServizioService } from 'src/app/API/servizio/servizio.service';
import { ServizioPipe } from 'src/app/API/PIPES/servizio/servizio.pipe';
import { Location, DatePipe, formatDate } from '@angular/common';
import { ListaMezziButtonComponent } from '../../shared/ng-smart-table-customs/lista-mezzi-button/lista-mezzi-button.component';
import { ListaComponenteButtonComponent } from '../../shared/ng-smart-table-customs/lista-componente-button/lista-componente-button.component';
import { ListaTachigrafoButtonComponent } from '../../shared/ng-smart-table-customs/lista-tachigrafo-button/lista-tachigrafo-button.component';
import { ListaAnagraficaButtonComponent } from '../../shared/ng-smart-table-customs/lista-anagrafica-button/lista-anagrafica-button.component';
import { ModalActionService } from 'src/app/API/modals/modal-action.service';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { NbDialogService, NbDateService, NbToastrService } from '@nebular/theme';
import { ServizioAggiungiModalComponent } from '../../shared/modals/servizio-aggiungi-modal/servizio-aggiungi-modal.component';
import { TipologiaService } from 'src/app/API/tipologia/tipologia.service';
import * as env from 'src/environments/env';
import * as globals from 'src/environments/globals';
import { ListaApplicativiButtonComponent } from '../../shared/ng-smart-table-customs/lista-applicativi-button/lista-applicativi-button.component';

@Component({
  selector: 'app-servizio-lista',
  templateUrl: './servizio-lista.component.html',
  styleUrls: ['./servizio-lista.component.less']
})

export class ServizioListaComponent implements OnInit {

  @ViewChild('delete_dialog') private dialog: TemplateRef<any>;

  constructor(
    private apiServizio: ServizioService,
    private apiTipologia: TipologiaService,
    private modalActions: ModalActionService,
    private toastrService: NbToastrService,
    private router: Router,
    private servizioPipe: ServizioPipe,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private dialogService: NbDialogService,
    private datePipe: DatePipe,
    private dateService: NbDateService<Date>
  ) {
    this.todayDate = datePipe.transform(dateService.today().toString(), 'dd-MM-yyyy_hh-mm');
  }

  @Input() origine = null;

  source: LocalDataSource = new LocalDataSource();
  source_filters = [];

  loadingData = true;

  listaAnagrafica = false;
  multiModifica = false;

  todayDate;

  settings = (env.rivenditore) ?
    {
      actions: {
        columnTitle: 'Azioni',
        position: 'right',
        add: false,
        delete: false
      },
      pager: {
        perPage: 20
      },
      mode: 'external',
      edit: {
        editButtonContent: '<i class="eva eva-eye-outline" title="Visualizza dettagli"></i>'
      },
      columns: {
        id: {
          title: 'ID',
          type: 'number',
          compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1,
        },
        anagrafica: {
          title: 'Anagrafica',
          type: 'custom',
          valuePrepareFunction: (cell, row) => row,
          renderComponent: ListaAnagraficaButtonComponent
        },
        dataInizio: {
          title: 'Data Inizio',
          type: 'html',
          width: '0',
          compareFunction: (dir, a, b) => this.sortDate(dir, a, b)
        },
        dataFine: {
          title: 'Data Fine',
          type: 'text',
          width: '0',
          compareFunction: (dir, a, b) => this.sortDate(dir, a, b)
        },
        prezzo: {
          title: 'Prezzo',
          type: 'number',
          compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1,
        },
        applicativoSolo: {
          title: 'Applicativo',
          type: 'custom',
          valuePrepareFunction: (cell, row) => row,
          renderComponent: ListaApplicativiButtonComponent
        },
        causalePeriodo: {
          title: 'Fatturazione',
          type: 'text'
        },
        veicolo: {
          title: 'Mezzo',
          type: 'text'
        },
        periferica: {
          title: 'Componente',
          type: 'text'
        },
        tachigrafo: {
          title: 'Tachigrafo',
          type: 'text'
        }
      }
    } : {
      actions: {
        columnTitle: 'Azioni',
        position: 'right'
      },
      pager: {
        perPage: 20
      },
      mode: 'external',
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmCreate: true,
      },
      edit: {
        editButtonContent: '<i class="nb-edit" title="Modifica"></i>',
        confirmSave: true,
      },
      delete: {
        title: 'Elimina',
        deleteButtonContent: '<i class="eva eva-copy-outline" title="Duplica"></i>',
        confirmDelete: true,
      },

      columns: {
        id: {
          title: 'ID',
          type: 'number',
          compareFunction: (dir, a, b) => +(a) >= +(b) ? dir * 1 : dir * -1,
        },
        anagrafica: {
          title: 'Anagrafica',
          type: 'custom',
          valuePrepareFunction: (cell, row) => row,
          renderComponent: ListaAnagraficaButtonComponent
        },
        parent: {
          title: 'Rivenditore',
          type: 'text'
        },
        dataInizio: {
          title: 'Data Inizio',
          type: 'html',
          width: '0',
          compareFunction: (dir, a, b) => this.sortDate(dir, a, b)
        },
        dataFine: {
          title: 'Data Fine',
          type: 'text',
          width: '0',
          compareFunction: (dir, a, b) => this.sortDate(dir, a, b)
        },
        prezzo: {
          title: 'Prezzo',
          type: 'number',
          compareFunction: (dir, a, b) => +(a) >= +(b) ? dir * 1 : dir * -1,
        },
        applicativoSolo: {
          title: 'Applicativo',
          type: 'custom',
          valuePrepareFunction: (cell, row) => row,
          renderComponent: ListaApplicativiButtonComponent
        },
        causalePeriodo: {
          title: 'Fatturazione',
          type: 'text'
        },
        veicolo: {
          title: 'Mezzo',
          type: 'custom',
          valuePrepareFunction: (cell, row) => {
            if (row.radiocomando?.length > 0) {
              return 'RADIOCOMANDO';
            } else {
              return row;
            }
          },
          renderComponent: ListaMezziButtonComponent
        },
        periferica: {
          title: 'Componente',
          type: 'custom',
          valuePrepareFunction: (cell, row) => {
            if (row.radiocomando?.length > 0) {
              return 'RADIOCOMANDO';
            } else {
              return row;
            }
          },
          renderComponent: ListaComponenteButtonComponent
        },
        tachigrafo: {
          title: 'Tachigrafo',
          type: 'custom',
          valuePrepareFunction: (cell, row) => {
            if (row.radiocomando?.length > 0) {
              return 'RADIOCOMANDO';
            } else {
              return row;
            }
          },
          renderComponent: ListaTachigrafoButtonComponent
        }
      }
    };

  settingsAnagrafica = (env.rivenditore) ?
    {
      actions: {
        columnTitle: 'Azioni',
        position: 'right',
        add: false,
        delete: false
      },
      pager: {
        perPage: 20
      },
      mode: 'external',
      edit: {
        editButtonContent: '<i class="eva eva-eye-outline" title="Visualizza dettagli"></i>'
      },
      columns: {
        id: {
          title: 'ID',
          type: 'number',
          compareFunction: (dir, a, b) => +(a) >= +(b) ? dir * 1 : dir * -1,
        },
        anagrafica: {
          title: 'Anagrafica',
          type: 'custom',
          valuePrepareFunction: (cell, row) => row,
          renderComponent: ListaAnagraficaButtonComponent
        },
        dataInizio: {
          title: 'Data Inizio',
          type: 'html',
          width: '0',
          compareFunction: (dir, a, b) => this.sortDate(dir, a, b)
        },
        dataFine: {
          title: 'Data Fine',
          type: 'text',
          width: '0',
          compareFunction: (dir, a, b) => this.sortDate(dir, a, b)
        },
        prezzo: {
          title: 'Prezzo',
          type: 'number',
          compareFunction: (dir, a, b) => +(a) >= +(b) ? dir * 1 : dir * -1,
        },
        applicativoSolo: {
          title: 'Applicativo',
          type: 'custom',
          valuePrepareFunction: (cell, row) => row,
          renderComponent: ListaApplicativiButtonComponent
        },
        causalePeriodo: {
          title: 'Fatturazione',
          type: 'text'
        },
        veicolo: {
          title: 'Mezzo',
          type: 'text'
        },
        periferica: {
          title: 'Componente',
          type: 'text'
        },
        tachigrafo: {
          title: 'Tachigrafo',
          type: 'text'
        }
      }
    } : {
      actions: {
        columnTitle: 'Azioni',
        position: 'right',
      },
      select: true,
      selectMode: 'multi',
      pager: {
        perPage: 20
      },
      mode: 'external',
      add: {
        addButtonContent: '<i class="nb-plus"></i>'
      },
      edit: {
        editButtonContent: '<i class="nb-edit" title="Modifica"></i>'
      },
      delete: {
        deleteButtonContent: '<i class="eva eva-copy-outline" title="Duplica"></i>'
      },
      columns: {
        id: {
          title: 'ID',
          type: 'number',
          compareFunction: (dir, a, b) => +(a) >= +(b) ? dir * 1 : dir * -1,
        },
        anagrafica: {
          title: 'Anagrafica',
          type: 'custom',
          valuePrepareFunction: (cell, row) => row,
          renderComponent: ListaAnagraficaButtonComponent
        },
        dataInizio: {
          title: 'Data Inizio',
          type: 'html',
          width: '0',
          compareFunction: (dir, a, b) => this.sortDate(dir, a, b)
        },
        dataFine: {
          title: 'Data Fine',
          type: 'text',
          width: '0',
          compareFunction: (dir, a, b) => this.sortDate(dir, a, b)
        },
        prezzo: {
          title: 'Prezzo',
          type: 'number',
          compareFunction: (dir, a, b) => +(a) >= +(b) ? dir * 1 : dir * -1,
        },
        applicativoSolo: {
          title: 'Applicativo',
          type: 'custom',
          valuePrepareFunction: (cell, row) => row,
          renderComponent: ListaApplicativiButtonComponent
        },
        causalePeriodo: {
          title: 'Fatturazione',
          type: 'text'
        },
        veicolo: {
          title: 'Mezzo',
          type: 'custom',
          valuePrepareFunction: (cell, row) => row,
          renderComponent: ListaMezziButtonComponent,
        },
        periferica: {
          title: 'Componente',
          type: 'custom',
          valuePrepareFunction: (cell, row) => row,
          renderComponent: ListaComponenteButtonComponent
        },
        tachigrafo: {
          title: 'Tachigrafo',
          type: 'custom',
          valuePrepareFunction: (cell, row) => row,
          renderComponent: ListaTachigrafoButtonComponent
        }
      }
    };

  anagrafica: string;
  qtaServizi: number;

  idAnagrafica = this.activatedRoute.snapshot.paramMap.get('id');

  ngOnInit(): void {
    if (globals.userRole == 1) {
      this.settings.delete.deleteButtonContent = '<i class="nb-trash" title="Elimina"></i>';
      this.settingsAnagrafica.delete.deleteButtonContent = '<i class="nb-trash" title="Elimina"></i>';
    }

    if (this.origine === 'dashboard') {
      this.settings.pager.perPage = 5;
    }

    this.loadDataTable(this.idAnagrafica);

    if (!env.rivenditore) {
      this.settings['rowClassFunction'] = (row) => {
        if (row.data.anagraficaParent !== null) {
          return 'sottoCliente';
        }
        return '';
      };
    }

    this.modalActions.refreshTable.subscribe(ok => this.loadDataTable(this.idAnagrafica));
  }

  destroyDate(data: string): Date {
    let d: string;
    if (data === '-') {
      d = '01/01/0001';
    } else if (data.indexOf('<br>') !== -1) {
      d = data.replace(/<[^>]+>/g, '').split(',')[0].trim();
    } else {
      d = data;
    }

    return new Date(+d.split('/')[2], +d.split('/')[1], +d.split('/')[0]);
  }

  sortDate(direction: any, a: string, b: string): number {

    const first = this.datePipe.transform(this.destroyDate(a), 'yyyyMMdd');
    const second = this.datePipe.transform(this.destroyDate(b), 'yyyyMMdd');

    if (first < second) {
      return -1 * direction;
    }
    if (first > second) {
      return direction;
    }
    return 0;
  }

  private _sortDate(direction: any, a: string, b: string): number {
    let first: number;
    let second: number;
    try {
      if (a === '-') {
        first = Number(new DatePipe('it-IT').transform('01/01/0001', 'yyyyMMdd'));
      } else if (a.indexOf('<br>') === -1) {

        first = Number(new DatePipe('it-IT').transform(a, 'yyyyMMdd'));
      } else {
        first = Number(new DatePipe('it-IT').transform(a.replace(/<[^>]+>/g, '').split(',')[0].trim(), 'yyyyMMdd'));
      }
      if (b === '-') {
        second = Number(new DatePipe('it-IT').transform('01/01/0001', 'yyyyMMdd'));
      } else if (b.indexOf('<br>') === -1) {
        second = Number(new DatePipe('it-IT').transform(b, 'yyyyMMdd'));
      } else {
        second = Number(new DatePipe('it-IT').transform(b.replace(/<[^>]+>/g, '').split(',')[0].trim(), 'yyyyMMdd'));
      }
    } catch (error) {
      console.error(error, direction, a, b);
    }

    if (first < second) {
      return -1 * direction;
    }
    if (first > second) {
      return direction;
    }
    return 0;
  }

  onUserRowSelect($event?): void {
    if ($event !== undefined) {
      if ($event.selected.length > 1) { this.multiModifica = true; } else { this.multiModifica = false; }
    } else { this.multiModifica = false; }
  }

  dialogMultiModifica(): void {
    this.dialogService.open(ServizioAggiungiModalComponent, { hasScroll: true, autoFocus: false })
      .onClose.subscribe(data => {
        this.loadDataTable(this.idAnagrafica);
        this.onUserRowSelect();
      })
  }

  loadDataTable(idAnagrafica): void {
    this.loadingData = true;
    if (idAnagrafica) {
      this.listaAnagrafica = true;
      this.apiServizio.filterByAnagraficaID(idAnagrafica).subscribe(
        resp => {
          this.source.load(this.servizioPipe.transformByAnagrafica(resp));
          this.loadingData = false;
          this.anagrafica = resp[0].anagrafica;
          this.qtaServizi = resp.length;
          this.source_filters = resp;
        });
    } else {
      if (this.router.url === '/pages/servizio/lista') {
        this.apiServizio.getAll().subscribe(
          resp => {
            this.source.load(this.servizioPipe.transform(resp));
            this.loadingData = false;
            this.source.getFilteredAndSorted().then(data => this.qtaServizi = data.length);
            this.source_filters = resp;
          });
      } else if (this.router.url === '/pages/servizio/listaAttivi') {
        this.apiServizio.getAttivi().subscribe(
          resp => {
            this.source.load(this.servizioPipe.transform(resp));
            this.loadingData = false;
            this.source.getFilteredAndSorted().then(data => this.qtaServizi = data.length);
            this.source_filters = resp;
          });
      } else if (this.router.url === '/pages/servizio/listaScaduti') {
        this.apiServizio.getScaduti().subscribe(
          resp => {
            this.source.load(this.servizioPipe.transform(resp));
            this.loadingData = false;
            this.source.getFilteredAndSorted().then(data => this.qtaServizi = data.length);
            this.source_filters = resp;
          });
      } else if (this.router.url === '/pages/servizio/listaFuturi') {
        this.apiServizio.getFuturi().subscribe(
          resp => {
            this.source.load(this.servizioPipe.transform(resp));
            this.loadingData = false;
            this.source.getFilteredAndSorted().then(data => this.qtaServizi = data.length);
            this.source_filters = resp;
          });
      } else if (this.router.url === '/pages/dashboard') {
        this.apiServizio.getAll().subscribe(
          resp => {
            this.source.load(this.servizioPipe.transform(resp));
            this.loadingData = false;
            this.source.getFilteredAndSorted().then(data => this.qtaServizi = data.length);
            this.source_filters = resp;
          });
      }
    }
  }

  downloadCSV(): void {
    this.todayDate = this.datePipe.transform(this.dateService.today().toString(), 'dd-MM-yyyy_hh-mm');
    const options = {
      showLabels: true,
      useBom: true,
      nullToEmptyString: false,
      decimalseparator: ',',
      headers: [
        'ID',
        'Anagrafica',
        'Data Inizio',
        'Data Fine',
        'Periodicità',
        'Prezzo',
        'Causale',
        'Mezzo',
        'Periferica',
        'Tachigrafo'
      ]
    };
    this.apiTipologia.filterByID(50).subscribe(data => {
      const newFile = new Angular5Csv(
        this.servizioPipe.transform2Export(this.source_filters, data.children),
        'Report Servizi_' + this.todayDate, options);
    });
  }

  goBack(): void {
    this.location.back();
  }

  onCreate(): void {
    const idAnagrafica = this.activatedRoute.snapshot.paramMap.get('id');
    if (idAnagrafica !== null) {
      this.router.navigate(['/pages/servizio/aggiungi/' + idAnagrafica]);
    } else {
      this.router.navigate(['/pages/servizio/aggiungi']);
    }
  }

  onEdit($event): void {
    if (this.idAnagrafica) {
      this.router.navigate(['/pages/servizio/modifica/' + this.idAnagrafica + '/' + $event.data.id]);
    } else {
      this.router.navigate(['/pages/servizio/modifica/' + $event.data.id]);
    }
  }

  onDelete($event): void {
    if (globals.userRole == 1) {
      this.dialogService.open(this.dialog, { context: $event }).onClose.subscribe(data => {
        if (data) {
          this.apiServizio.deleteServizio($event.data.id).subscribe(() => {
            this.toastrService.success('Riga eliminata con successo', 'Operazione Completata')
            this.loadDataTable(this.idAnagrafica);
          }, error => {
            this.toastrService.danger(error, 'Operazione NON Completata');
            console.log(error);
          });
        } else {
          this.toastrService.info('', 'Operazione Annullata');
        }
      });
    } else {
      this.router.navigate(['/pages/servizio/duplicated/' + $event.data.id]);
    }
  }
}
