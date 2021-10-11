import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { IndirizzoService } from 'src/app/API/indirizzo/indirizzo.service';
import { IndirizzoCreaPipe } from 'src/app/API/PIPES/indirizzo/indirizzo-crea.pipe';

@Component({
  selector: 'app-indirizzo-lista',
  templateUrl: './indirizzo-lista.component.html',
  styleUrls: ['./indirizzo-lista.component.less']
})
export class IndirizzoListaComponent implements OnInit {

  constructor(
    private apiIndirizzo: IndirizzoService,
    private indirizzoPipe: IndirizzoCreaPipe,
    private router: Router,
    private toastrService: NbToastrService
  ) { }

  source: LocalDataSource = new LocalDataSource();

  loadingData = true;

  settings = {
    actions: {
      columnTitle: 'Azioni',
      position: 'right',
      add: false
    },
    mode: 'external',
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
    },
    columns: {
      id: {
        title: 'ID',
        compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1,
      },
      nome: {
        title: 'Anagrafica',
        type: 'string'
      },
      nazione: {
        title: 'Nazione',
        type: 'string'
      },
      provincia: {
        title: 'Provincia',
        type: 'string'
      },
      comune: {
        title: 'Comune',
        type: 'string'
      },
      via: {
        title: 'Via',
        type: 'string'
      },
      civico: {
        title: 'Civico',
        type: 'string'
      },
      cap: {
        title: 'CAP',
        type: 'number'
      },
    },
  };

  ngOnInit() {
    this.apiIndirizzo.getAll().subscribe(
      indirizzo => {
        this.source.load(this.indirizzoPipe.transformLista(indirizzo));
        this.loadingData = false;
      }
    );
  }

  onCreate() {
    this.toastrService.danger('L inserimento di un indirizzo singolo è deprecato!', 'FUNZIONE DEPRECATA!');
    // this.router.navigate(['/pages/indirizzo/aggiungi']);
  }

  onEdit($event) {
    this.router.navigate(['/pages/indirizzo/modifica/' + $event.data.id]);
  }

  onDelete($event) {
    this.loadingData = true;
    this.apiIndirizzo.deleteIndirizzo($event.cells[0].value).subscribe(() => {
      this.source.remove($event.data);
      this.loadingData = false;
    });
  }

}
