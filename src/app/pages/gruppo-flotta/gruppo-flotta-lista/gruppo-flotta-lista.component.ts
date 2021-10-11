import { Component, OnInit } from '@angular/core';
import { FlottaService } from 'src/app/API/flotta/flotta.service';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-gruppo-flotta-lista',
  templateUrl: './gruppo-flotta-lista.component.html',
  styleUrls: ['./gruppo-flotta-lista.component.less']
})
export class GruppoFlottaListaComponent implements OnInit {

  constructor(
    private apiFlotta: FlottaService,
    private router: Router) { }

  source: LocalDataSource = new LocalDataSource();

  loadingData = true;

  settings = {
    actions: {
      columnTitle: 'Azioni',
      position: 'right'
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
        type: 'number'
      },
      username: {
        title: 'Utente',
        type: 'string'
      },
      flotta: {
        title: 'Nome flotta',
        type: 'string'
      },
      descrizione: {
        title: 'Descrizione',
        type: 'string'
      },
    },
  };

  ngOnInit() {
    this.apiFlotta.getAll().subscribe(
      data => {
        this.source.load(data);
        this.loadingData = false;
      }
    )
  }

  onCreate() {
    this.router.navigate(['/pages/gruppoflotta/aggiungi']);
  }

  onEdit(event) {
    this.router.navigate(['/pages/gruppoflotta/modifica/' + event.data.id]);
  }
}
