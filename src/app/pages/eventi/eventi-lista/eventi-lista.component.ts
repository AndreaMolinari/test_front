import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { EventiService } from 'src/app/API/eventi/eventi.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';

@Component({
  selector: 'app-eventi-lista',
  templateUrl: './eventi-lista.component.html',
  styleUrls: ['./eventi-lista.component.less']
})
export class EventiListaComponent implements OnInit {

  constructor(private _router: Router, private _apiEventi: EventiService, private _toastrService: NbToastrService) { }

  source: LocalDataSource = new LocalDataSource();

  loadingData: Boolean = true;

  settings = {
    actions: {
      columnTitle: 'Azioni',
      position: "right",
    },
    mode: "inline",
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true
    },
    edit: {
      mode: 'inline',
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      code: {
        title: 'Codice',
        type: 'string'
      },
      message: {
        title: 'Messaggio',
        type: 'string'
      }
    },
  };
  
  ___settings = {
    actions: {
      columnTitle: 'Azioni',
      position: "right",
    },
    mode: "inline",
    add: {
      mode: "inline",
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      mode: "inline",
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      mode: "external",
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'ID',
        type: 'number',
        editable: false,
      },
      messaggio: {
        title: 'Messaggio',
        type: 'string'
      },
      codice: {
        title: 'Codice',
        type: 'string'
      }
    },
  };

  ngOnInit() {
    this._apiEventi.getAll().subscribe(
      resp => {
        this.source.load(resp);
        this.loadingData = false;
      }
    )
  }

  onCreate($event){
    this.loadingData = true;
    this._apiEventi.addEventi($event.newData).subscribe(resp => {
      $event.confirm.resolve();
      this._toastrService.success("Evento aggiunto correttamente!", "Operazione Completata");
      this.loadingData = false;
    }, error =>{
      this._toastrService.danger(error, "ERRORE CONNESSIONE AL DB!");
      this.loadingData = false;
    });
  }

  onEdit($event){
    this.loadingData = true;
    this._apiEventi.putEventi($event.newData).subscribe(resp => {
      $event.confirm.resolve();
      this._toastrService.success("Evento modificato correttamente!", "Operazione Completata");
      this.loadingData = false;
    }, error =>{
      this._toastrService.danger(error, "ERRORE CONNESSIONE AL DB!");
      this.loadingData = false;
    });
  }

  onDelete($event){
    this.loadingData = true;
    this._apiEventi.deleteEventi($event.data.id).subscribe(
      resp => {
        this.source.remove($event.data);
        this._toastrService.success("Evento eliminato correttamente!", "Operazione Completata");
        this.loadingData = false;
      }, error => {
        this._toastrService.danger(error, "ERRORE CONNESSIONE AL DB!");
        this.loadingData = false;
      }
    );
  }

}
