import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { ModelloService } from 'src/app/API/modello/modello.service';
import { ModelloPipe } from 'src/app/API/PIPES/modello/modello.pipe';
import * as globals from 'src/environments/globals';

@Component({
  selector: 'app-modello-lista',
  templateUrl: './modello-lista.component.html',
  styleUrls: ['./modello-lista.component.less']
})

export class ModelloListaComponent implements OnInit {

  @ViewChild('delete_dialog') private dialog: TemplateRef<any>;

  constructor(
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private apiModello: ModelloService,
    private pipeModello: ModelloPipe,
    private router: Router) { }

  source: LocalDataSource = new LocalDataSource();

  loadingData = true;

  settings = {
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
        compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1,
      },
      modello: {
        title: 'Modello',
        type: 'string',
      },
      marca: {
        title: 'Brand',
        type: 'string',
      },
      tipologia: {
        title: 'Tipologia',
        type: 'string',
      }
    },
  };

  ngOnInit() {

    if ( globals.userRole === 1 )
    {
      this.settings.actions.delete = true;
    }

    this.apiModello.getAll().subscribe(resp => {
      this.source.load(this.pipeModello.transformList(resp));
      this.loadingData = false;
    }
    );
  }

  onCreate() {
    this.router.navigate(['/pages/modello/aggiungi']);
  }

  onEdit(event) {
    this.router.navigate(['/pages/modello/modifica/' + event.data.id]);
  }

  onDelete($event) {
    this.dialogService.open(this.dialog, {context: $event}).onClose.subscribe(data => {
      if(data){
        this.apiModello.deleteModello($event.data.id).subscribe(() => {
          this.toastrService.success('Riga eliminata con successo', 'Operazione Completata');
          this.source.remove($event.data);
        }, error => {
          this.toastrService.danger(error, 'Operazione NON Completata');
          console.log(error);
        });
      }else{
        this.toastrService.info('', 'Operazione Annullata');
      }
    });
  }

}
