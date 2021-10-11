import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { ContattoService } from 'src/app/API/contatto/contatto.service';
import { ContattoPipe } from 'src/app/API/PIPES/contatto/contatto.pipe';
import { NbToastrService } from '@nebular/theme';
import { TipologiaService } from 'src/app/API/tipologia/tipologia.service';

@Component({
  selector: 'app-contatto-lista',
  templateUrl: './contatto-lista.component.html',
  styleUrls: ['./contatto-lista.component.less']
})
export class ContattoListaComponent implements OnInit {

  constructor(
    private _apiContatto: ContattoService,
    private _apiTipologia: TipologiaService,
    private _contattoPIPE: ContattoPipe,
    private _router: Router,
    private _toastrService: NbToastrService) { }

  source: LocalDataSource = new LocalDataSource();

  loadingData: Boolean = true;

  arrayTipologie: []

  settings = {
    actions: {
      columnTitle: 'Azioni',
      position: "right",
    },
    mode: "external",
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
        compareFunction: (dir, a, b) => parseInt(a) >= parseInt(b) ? dir * 1 : dir * -1,
      },
      anagrafica: {
        title: 'Anagrafica',
        type: 'html',
      },
      nome: {
        title: 'Nome',
        type: 'string'
      },
      contatto: {
        title: 'Contatto',
        type: 'string',
      },
      descrizione: {
        title: 'Descrizione',
        type: 'string',
      },
      predefinito: {
        title: 'Predefinito',
        type: 'string',
      },
    },
  };

  ngOnInit() {
    this._apiContatto.getAll().subscribe(
      resp => {
        this.source.load(this._contattoPIPE.transform(resp));
        this.loadingData = false;
      }
    )
  }

  exportContatti(): void {
    console.error("Qua faccio la chiamata, ma per adesso manca")
  }

  onCreate() {
    this._router.navigate(['/pages/contatto/aggiungi']);
  }

  onEdit($event) {
    this._router.navigate(['/pages/contatto/modifica/' + $event.data.id]);
  }

  onDelete($event) {
    this.loadingData = true;
    this._apiContatto.deleteContatto($event.cells[0].value).subscribe(
      data => {
        this.source.remove($event.data);
        this.loadingData = false;
      }, error => {
        this.loadingData = false;
        this._toastrService.danger(error, "IMPOSSIBILE COMPLETARE L'AZIONE!")
      }
    );
  }

}
