import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { FlottaService } from 'src/app/API/flotta/flotta.service';
import { FlottaPipe } from 'src/app/API/PIPES/flotta/flotta.pipe';
import * as env from 'src/environments/env';

@Component({
  selector: 'app-servizio-in-flotta-modal',
  templateUrl: './servizio-in-flotta-modal.component.html',
  styleUrls: ['./servizio-in-flotta-modal.component.less']
})
export class ServizioInFlottaModalComponent implements OnInit {

  @Input() data: string;

  constructor(
    private apiFlotta: FlottaService,
    private flottaPIPE: FlottaPipe,
    private router: Router,
    private toastrService: NbToastrService,
    private dialogRef: NbDialogRef<any>) { }

  source: LocalDataSource = new LocalDataSource();

  loadingData = true;

  settings = (env.rivenditore) ?
    {
      actions: {
        columnTitle: 'Azioni',
        position: 'right',
        delete: false
      },
      mode: 'external',
      edit: {
        editButtonContent: '<i class="eva eva-chevron-right-outline title="Aggiungi alla flotta"></i>'
      },
      columns: {
        id: {
          title: 'ID',
          compareFunction: (dir, a, b) => a >= b ? dir * 1 : dir * -1,
        },
        nome: {
          title: 'Nome flotta',
          type: 'text',
          class: 'no-wrap'
        },
        nservizio: {
          title: 'Servizi Attivi',
          type: 'text',
          width: '0'
        },
        username: {
          title: 'Utente',
          type: 'text'
        },
        descrizione: {
          title: 'Descrizione',
          type: 'text'
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
        addButtonContent: '<i class="nb-plus"></i>'
      },
      edit: {
        editButtonContent: '<i class="eva eva-chevron-right-outline" title="Aggiungi alla flotta"></i>'
      },
      delete: {
        deleteButtonContent: '<i class="nb-trash"></i>'
      },
      columns: {
        id: {
          title: 'ID',
          compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1,
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
    this.getFlottaData();
  }

  getFlottaData(): void {
    this.apiFlotta.getAll().subscribe(
      data => {
        this.source.load(this.flottaPIPE.transform(data));
        this.loadingData = false;
      }
    );
  }

  onCreate(): void {
    this.router.navigate(['pages/flotta/aggiungi/' + this.data]);
    this.dialogRef.close(false);
  }

  onEdit($event): void {
    this.loadingData = true;
    this.apiFlotta.filterByID_OBS($event.data.id).subscribe({
      next: response => {
        const newFlotta = response;
        newFlotta[0].servizio.push({
          idServizio: this.data,
          nickname: null,
          icona: '&#xe908;'
        });

        this.apiFlotta.putFlotta(newFlotta[0]).subscribe(respPut => {
          this.loadingData = false;
          this.toastrService.success('Il servizio è stato aggiunto con successo alla flotta...', 'OK!');
          this.dialogRef.close(true);
        }, () => { this.toastrService.danger(`Qualcosa è andato storto durante l'inserimento`, 'ERRORE SERVER!'); });
      },
      error: () => this.toastrService.danger(`Qualcosa è andato storto durante l'inserimento`, 'ERRORE SERVER!')
    });
  }

}
