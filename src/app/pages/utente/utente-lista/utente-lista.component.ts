import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { UtenteService } from 'src/app/API/utente/utente.service';
import { UtentePipe } from 'src/app/API/PIPES/utente/utente.pipe';
import { TipologiaService } from 'src/app/API/tipologia/tipologia.service';
import { ListaAnagraficaButtonComponent } from '../../shared/ng-smart-table-customs/lista-anagrafica-button/lista-anagrafica-button.component';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-utente-lista',
  templateUrl: './utente-lista.component.html',
  styleUrls: ['./utente-lista.component.less']
})

export class UtenteListaComponent implements OnInit {

  constructor(
    private apiUtente: UtenteService,
    private apiTipologia: TipologiaService,
    private router: Router,
    private pipeUtente: UtentePipe,
    private toastrService: NbToastrService
  ) {
    this.apiTipologia.filterByID(2).subscribe(data => {
      this.arrayTipologie = pipeUtente.transformSelectTable(data.all_children);
      this.settings = {
        actions: {
          columnTitle: 'Azioni',
          position: 'right',
          // add: false
        },
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
            compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1,
          },
          anagrafica: {
            title: 'Anagrafica',
            type: 'custom',
            valuePrepareFunction: (cell, row) => row,
            renderComponent: ListaAnagraficaButtonComponent
          },
          tipologia: {
            title: 'Tipologia',
            type: 'html',
            filter: {
              type: 'list',
              config: {
                selectText: 'Tipologia',
                list: this.arrayTipologie
              },
            },
          },
          username: {
            title: 'Username',
            type: 'string',
          },
          actiaUser: {
            title: 'Actia Username',
            type: 'string'
          },
          bloccato: {
            title: 'Bloccato'
          }
        },
      };
    });
  }

  arrayTipologie: [];

  source: LocalDataSource = new LocalDataSource();

  loadingData = true;

  settings = {
    actions: {
      columnTitle: 'Azioni',
      position: 'right',
      // add: false
    },
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
        compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1,
      },
      anagrafica: {
        title: 'Anagrafica',
        type: 'custom',
        valuePrepareFunction: (cell, row) => row,
        renderComponent: ListaAnagraficaButtonComponent
      },
      tipologia: {
        title: 'Tipologia',
        type: 'html',
        filter: {
          type: 'list',
          config: {
            selectText: 'Tipologia',
            list: []
          },
        },
      },
      username: {
        title: 'Username',
        type: 'string',
      },
      actiaUser: {
        title: 'Actia Username',
        type: 'string'
      },
      bloccato: {
        title: 'Bloccato'
      }
    },
  };

  ngOnInit() {
    this.apiUtente.getAll().subscribe(
      data => {
        this.source.load(this.pipeUtente.transform(data));
        this.loadingData = false;
      }
    );
  }

  onCreate() {
    // this.toastrService.danger('La funzione di inserimento utente singolo è deprecata!', 'FUNZIONE DEPRECATA!');
    this.router.navigate(['/pages/utente/aggiungi']);
  }

  onEdit(event) {
    this.router.navigate(['/pages/utente/modifica/' + event.data.id]);
  }

  onDelete($event) {
    this.toastrService.danger('Al momento questa funzione non è disponibile', 'Operazione non disponibile!');
  }

}
