import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FlottaService } from 'src/app/API/flotta/flotta.service';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { FlottaPipe } from 'src/app/API/PIPES/flotta/flotta.pipe';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import * as env from 'src/environments/env';
import * as globals from 'src/environments/globals';

@Component({
  selector: 'app-flotta-lista',
  templateUrl: './flotta-lista.component.html',
  styleUrls: ['./flotta-lista.component.less']
})

export class FlottaListaComponent implements OnInit {

  @ViewChild('delete_dialog') private dialog: TemplateRef<any>;

  constructor(
    private apiFlotta: FlottaService,
    private flottaPIPE: FlottaPipe,
    private router: Router,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService) { }

  source: LocalDataSource = new LocalDataSource();

  loadingData = true;

  settings = (env.rivenditore) ?
    {
      actions: {
        columnTitle: 'Azioni',
        position: 'right',
        add: false,
        delete: false
      },
      mode: 'external',
      edit: {
        editButtonContent: '<i class="eva eva-eye-outline" title="Visualizza dettagli"></i>'
      },
      columns: {
        id: {
          title: 'ID',
          compareFunction: (dir, a, b) => parseInt(a) >= parseInt(b) ? dir * 1 : dir * -1,
        },
        nome: {
          title: 'Nome flotta',
          type: 'string',
          class: 'no-wrap'
        },
        nservizio: {
          title: 'Servizi Attivi',
          type: 'string',
          width: '0'
        },
        username: {
          title: 'Utente',
          type: 'string'
        },
        descrizione: {
          title: 'Descrizione',
          type: 'string'
        }
      }
    }
    :
    {
      actions: {
        columnTitle: 'Azioni',
        position: 'right',
        delete: false
      },
      mode: 'external',
      add: {
        addButtonContent: '<i class="nb-plus"></i>',
        createButtonContent: '<i class="nb-checkmark"></i>',
        cancelButtonContent: '<i class="nb-close"></i>',
        confirmCreate: true,
      },
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
        id: {
          title: 'ID',
          compareFunction: (dir, a, b) => parseInt(a) >= parseInt(b) ? dir * 1 : dir * -1,
        },
        nome: {
          title: 'Nome flotta',
          type: 'string',
          class: 'no-wrap'
        },
        nservizio: {
          title: 'Servizi Attivi',
          type: 'string',
          width: '0'
        },
        username: {
          title: 'Utente',
          type: 'string'
        },
        descrizione: {
          title: 'Descrizione',
          type: 'string'
        }
      }
    };

  ngOnInit() {
    if (globals.userRole == 1) {
      this.settings.actions.delete = true;
    }
    this.apiFlotta.getAll().subscribe(
      data => {
        this.source.load(this.flottaPIPE.transform(data));
        this.loadingData = false;
      }
    );
  }

  navigateToGruppi() {
    this.router.navigate(['/pages/gruppoflotta/lista']);
  }

  onCreate() {
    this.router.navigate(['/pages/flotta/aggiungi']);
  }

  onEdit(event) {
    this.router.navigate(['/pages/flotta/modifica/' + event.data.id]);
  }

  // ! questo metodo non esiste!
  onDelete($event) {
    if (globals.userRole <= 2) {
      this.dialogService.open(this.dialog, { context: $event }).onClose.subscribe(data => {
        if (data) {
          this.apiFlotta.deleteFlotta($event.data.id).subscribe(() => {
            this.toastrService.success('Riga eliminata con successo', 'Operazione Completata');
            this.source.remove($event.data);
          }, error => {
            this.toastrService.danger(error, 'Operazione NON Completata');
            console.log(error);
          });
        } else {
          this.toastrService.info('', 'Operazione Annullata');
        }
      });
    }
  }

}
