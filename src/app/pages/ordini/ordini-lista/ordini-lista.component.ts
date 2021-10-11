import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-ordini-lista',
  templateUrl: './ordini-lista.component.html',
  styleUrls: ['./ordini-lista.component.less']
})
export class OrdiniListaComponent implements OnInit {

  constructor(private _router: Router, private _toastrService: NbToastrService) { }

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
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
    deleteButtonContent: '<i class="nb-trash"></i>',
  },
    columns: {
      id: {
        title: '#',
        compareFunction: (dir, a, b) => parseInt(a) >= parseInt(b) ? dir*1 : dir*-1,
      }
    }
  }

  ngOnInit() {
    this._toastrService.danger('', 'Non conosco le API');
    this.loadingData = false;
    //! API.getAll().subscribe(
    //   resp => {
    //     this.source.load(resp)
    //     this.loadingData = false;
    //   }
    // )
  }

  onCreate(){
    this._router.navigate(['/pages/ordini/aggiungi']);
  }

  onEdit($event){
    this._router.navigate(['/pages/ordini/modifica/'+$event.data.id]);
  }

  onDelete($event){
    this.loadingData = true;
    //! API
  }

}
