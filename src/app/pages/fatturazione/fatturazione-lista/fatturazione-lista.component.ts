import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { FatturazioneService } from 'src/app/API/fatturazione/fatturazione.service';
import { FatturazionePipe } from 'src/app/API/PIPES/fatturazione/fatturazione.pipe';

@Component({
  selector: 'app-fatturazione-lista',
  templateUrl: './fatturazione-lista.component.html',
  styleUrls: ['./fatturazione-lista.component.less']
})
export class FatturazioneListaComponent implements OnInit {

  constructor(private _apiFatturazione: FatturazioneService, private _fatturazionePIPE: FatturazionePipe, private _router: Router) { }

  source: LocalDataSource = new LocalDataSource();

  loadingData: Boolean = true;

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
        compareFunction: (dir, a, b) => parseInt(a) >= parseInt(b) ? dir*1 : dir*-1,
      },
      anagrafica: {
        title: 'Anagrafica',
        type: 'string'
      },
      modFatturazione_string: {
        title: 'Modalità',
        type: 'string'
      },
      cadenza_string: {
        title: 'Cadenza',
        type: 'string'
      },
      periodo_string: {
        title: 'Periodo',
        type: 'string'
      },
      splitPA: {
        title: 'SPLIT',
        type: 'string'
      },
      esenteIVA: {
        title: 'Esente',
        type: 'string'
      },
    },
  };

  ngOnInit() {
    this._apiFatturazione.getAll().subscribe(
      data => {
        this.source.load(this._fatturazionePIPE.transform(data))
        this.loadingData = false;
      }
    )
  }

  onCreate(){
    this._router.navigate(['/pages/fatturazione/aggiungi']);
  }

  onEdit(event){
    this._router.navigate(['/pages/fatturazione/modifica/'+event.data.id]);
  }

  onDelete($event){
    alert("Non puoi cancellare una fattura da qua!");
  }

}
