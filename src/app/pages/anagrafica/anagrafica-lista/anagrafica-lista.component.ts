import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { AnagraficaService } from 'src/app/API/anagrafica/anagrafica.service';
import { AnagraficaPipe } from 'src/app/API/PIPES/anagrafica/anagrafica.pipe';
import { ListaServiziButtonComponent } from '../../shared/ng-smart-table-customs/lista-servizi-button/lista-servizi-button.component';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import * as env from 'src/environments/env';
import * as globals from 'src/environments/globals';
import { NbMenuService, NbDateService, NbToastrService, NbDialogService } from '@nebular/theme';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-anagrafica-lista',
  templateUrl: './anagrafica-lista.component.html',
  styleUrls: ['./anagrafica-lista.component.less']
})

export class AnagraficaListaComponent implements OnInit {

  @ViewChild('delete_dialog') private dialog: TemplateRef<any>;

  constructor(
    private dialogService: NbDialogService,
    private apiAnagrafica: AnagraficaService,
    private router: Router,
    private anaPipe: AnagraficaPipe,
    private activatedRoute: ActivatedRoute,
    private nbMenuService: NbMenuService,
    private datePipe: DatePipe,
    private toastrService: NbToastrService,
    private dateService: NbDateService<Date>) {
    this.todayDate = this.datePipe.transform(this.dateService.today().toString(), 'dd-MM-yyyy_hh-mm');
  }

  todayDate;

  @Input() origine = null;

  env = env;

  source: LocalDataSource = new LocalDataSource();
  source_filter = [];

  exportItems = [{ title: '.CSV', icon: 'file-outline' }, { title: '.XLSX', icon: 'file-outline' }];

  loadingData = true;

  settings = {
    actions: {
      columnTitle: 'Azioni',
      position: 'right',
      delete: false
    },
    mode: 'external',
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit" title="Modifica"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash" title="Elimina"></i>',
    },
    pager: {
      perPage: 10
    },
    columns: {
      id: {
        title: 'ID',
        compareFunction: (dir, a, b) => parseInt(a) >= parseInt(b) ? dir * 1 : dir * -1,
      },
      nome: {
        title: 'Nome / RagSoc',
        type: 'string'
      },
      codFisc: {
        title: 'CodFisc / pIva',
        type: 'string'
      },
      genere: {
        title: 'Genere',
        type: 'string'
      },
      parent: {
        title: 'Rivenditore',
        type: 'text'
      },
      servizi: {
        title: 'Servizi',
        type: 'custom',
        compareFunction: (dir, a, b) => parseInt(a) >= parseInt(b) ? dir * 1 : dir * -1,
        valuePrepareFunction: (cell, row) => row,
        renderComponent: ListaServiziButtonComponent
      },
      bloccato: {
        title: 'Bloccato',
        type: 'string',
        width: '0'
      }
    },
  };

  settingsMLS = {
    actions: {
      columnTitle: 'Azioni',
      position: 'right',
      delete: false
    },
    mode: 'external',
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit" title="Modifica"></i>',
    },
    columns: {
      id: {
        title: 'ID',
        compareFunction: (dir, a, b) => parseInt(a) >= parseInt(b) ? dir * 1 : dir * -1,
      },
      nome: {
        title: 'Nome / RagSoc',
        type: 'string'
      },
      codFisc: {
        title: 'CodFisc / pIva',
        type: 'string'
      },
      genere: {
        title: 'Genere',
        type: 'string'
      },
      servizi: {
        title: 'Servizi',
        type: 'custom',
        compareFunction: (dir, a, b) => parseInt(a) >= parseInt(b) ? dir * 1 : dir * -1,
        valuePrepareFunction: (cell, row) => row,
        renderComponent: ListaServiziButtonComponent
      },
      bloccato: {
        title: 'Bloccato',
        type: 'string',
        width: '0'
      }
    },
  };

  idTipologia;

  ngOnInit() {
    this.checkConfig(this.origine);

    if (!env.rivenditore) {
      this.settings['rowClassFunction'] = (row) => {
        if (row.data.anagraficaParent !== null) {
          return 'sottoCliente';
        }
        return '';
      };
    }

    this.getAnagrafiche();

    this.nbMenuService.onItemClick().subscribe(data => {
      if (data.item.title === '.CSV') { this.downloadCSV(); }
      if (data.item.title === '.XLSX') { alert('Non ancora implementato'); }
    })
  }

  getAnagrafiche() {
    if (this.origine === 'dashboard') {
      this.apiAnagrafica.getLatest().subscribe(
        resp => {
          this.source.load(this.anaPipe.transformLatests(resp));
          this.loadingData = false;
          this.source_filter = resp;
        });
    } else {
      this.activatedRoute.data.subscribe(data => {
        this.idTipologia = data.idTipologia;
        if (this.idTipologia !== undefined) {
          this.apiAnagrafica.filterByTipologia(this.idTipologia).subscribe(resp => {
            this.source.load(this.anaPipe.transform(resp));
            this.loadingData = false;
          });
        } else {
          this.apiAnagrafica.getAll().subscribe(
            resp => {
              this.source.load(this.anaPipe.transform(resp));
              this.loadingData = false;
              this.source_filter = resp;
            });
        }
      });
    }
    this.source.onChanged().subscribe((change) => {
      if (change.action === 'filter') {
        if (change.filter.filters[0].search !== '') {
          this.source.getFilteredAndSorted().then(data => this.source_filter = data);
        } else {
          this.source.getFilteredAndSorted().then(data => this.source_filter = data);
        }
      }
    });
  }

  checkConfig(origine: string) {
    if ( globals.userRole == 1 ) {
      this.settings.actions.delete = true;
    }

    if (origine === 'dashboard') {
      const settingsDashboard = {
        actions: {
          columnTitle: 'Azioni',
          position: 'right',
          delete: false
        },
        mode: 'external',
        add: {
          addButtonContent: '<i class="nb-plus"></i>',
        },
        edit: {
          editButtonContent: '<i class="nb-edit" title="Modifica"></i>',
        },
        pager: {
          perPage: 30
        },
        columns: {
          nome: {
            title: 'Nome / RagSoc',
            type: 'string'
          },
          codFisc: {
            title: 'CodFisc / pIva',
            type: 'string'
          },
          parent: {
            title: 'Rivenditore',
            type: 'text'
          },
          servizi: {
            title: 'Servizi',
            type: 'custom',
            compareFunction: (dir, a, b) => parseInt(a) >= parseInt(b) ? dir * 1 : dir * -1,
            valuePrepareFunction: (cell, row) => row,
            renderComponent: ListaServiziButtonComponent
          }
        },
      };
      Object.assign(this.settings, settingsDashboard);
    }
  }

  onCreate() {
    if (this.idTipologia !== undefined) {
      this.router.navigate(['/pages/anagrafica/aggiungi/' + this.idTipologia]);
    } else {
      this.router.navigate(['/pages/anagrafica/aggiungi']);
    }
  }

  onEdit($event) {
    this.router.navigate(['/pages/anagrafica/modifica/' + $event.data.id]);
  }

  onDelete($event) {
    this.dialogService.open(this.dialog, {context: $event}).onClose.subscribe(data => {
      if(data){
        this.apiAnagrafica.deleteAnagrafica($event.data.id).subscribe(() => {
          this.toastrService.success('Riga eliminata con successo', 'Operazione Completata')
          this.getAnagrafiche();
        }, error => {
          this.toastrService.danger(error, 'Operazione NON Completata');
          console.log(error);
        });
      }else{
        this.toastrService.info('', 'Operazione Annullata');
      }
    });
  }

  downloadCSV() {
    this.todayDate = this.datePipe.transform(this.dateService.today().toString(), 'dd-MM-yyyy_hh-mm');
    const options = {
      showLabels: true,
      showTitle: true,
      title: 'Report Anagrafiche',
      useBom: true,
      nullToEmptyString: true,
      headers: [
        'ID',
        'Nome / Rag.Soc.',
        'Cod.Fisc. / P.IVA',
        'Sesso',
        'Servizi',
        'Bloccato'
      ]
    };
    new Angular5Csv(this.anaPipe.transform2Export(this.source_filter), 'Report Anagrafiche_' + this.todayDate, options);
  }
}
