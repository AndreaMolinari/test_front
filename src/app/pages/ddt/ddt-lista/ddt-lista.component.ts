import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'app-ddt-lista',
  templateUrl: './ddt-lista.component.html',
  styleUrls: ['./ddt-lista.component.less']
})
export class DdtListaComponent implements OnInit {

  constructor(private router: Router, private toastrService: NbToastrService) { }

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
        compareFunction: (dir, a, b) => parseInt(a) >= parseInt(b) ? dir * 1 : dir * -1,
      }
    }
  }

  ngOnInit() {
    this.toastrService.danger('', 'Non conosco le API');
    this.loadingData = false;
    // ! API.getAll().subscribe(
    //   resp => {
    //     this.source.load(resp)
    //     this.loadingData = false;
    //   }
    // )
  }

  onCreate() {
    this.router.navigate(['/pages/ddt/aggiungi']);
  }

  onEdit($event) {
    this.router.navigate(['/pages/ddt/modifica/' + $event.data.id]);
  }

  onDelete($event) {
    this.loadingData = true;
    // ! API
  }

}
