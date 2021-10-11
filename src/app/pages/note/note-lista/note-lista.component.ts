import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { NoteService } from 'src/app/API/note/note.service';

@Component({
  selector: 'app-note-lista',
  templateUrl: './note-lista.component.html',
  styleUrls: ['./note-lista.component.less']
})
export class NoteListaComponent implements OnInit {

  constructor(private _apiNote: NoteService , private _router: Router) { }

  source: LocalDataSource = new LocalDataSource();

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
        type: 'number'
      },
      username: {
        title: 'Username',
        type: 'string'
      },
    },
  };

  ngOnInit() {
    this._apiNote.getAll().subscribe(
      utente => {
        this.source.load(utente)
      }
    )
  }

  onCreate(){
    this._router.navigate(['/pages/note/aggiungi']);
  }

  onEdit(event){
    // console.log("DA FARE: Rotte per la modifica");
    // this._router.navigate(['/pages/utente/modifica/'+event.data.id]);
  }

}
