import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { MezzoService } from 'src/app/API/mezzo/mezzo.service';
import { MezzoPipe } from 'src/app/API/PIPES/mezzo/mezzo.pipe';
import { BrandPipe } from 'src/app/API/PIPES/brand/brand.pipe';
import { ModelloPipe } from 'src/app/API/PIPES/modello/modello.pipe';
import { BrandService } from 'src/app/API/brand/brand.service';
import * as globals from 'src/environments/globals';
import { NbDialogService, NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-mezzo-lista',
  templateUrl: './mezzo-lista.component.html',
  styleUrls: ['./mezzo-lista.component.less']
})

export class MezzoListaComponent implements OnInit {

  @ViewChild('delete_dialog') private dialog: TemplateRef<any>;

  constructor(
    private apiMezzo: MezzoService,
    private apiBrand: BrandService,
    private mezzoPipe: MezzoPipe,
    private modelloPipe: ModelloPipe,
    private brandPipe: BrandPipe,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private router: Router
  ) {

    this.apiBrand.filterByTipologia(64).subscribe(resp => {
      this.arrayModelli = [];
      this.arrayBrand = this.brandPipe.transformNGSelect(resp);
      resp.forEach(brand => {
        this.modelloPipe.transformNGSelect(brand.modelli).forEach(modello => {
          this.arrayModelli.push(modello);
        });
      });
      this.arrayBrand.sort((a, b) => {
        const textA = a.marca.toUpperCase();
        const textB = b.marca.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.arrayModelli.sort((a, b) => {
        const textA = a.modello.toUpperCase();
        const textB = b.modello.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.settings = {
        actions: {
          columnTitle: 'Azioni',
          position: 'right',
          delete: (globals.userRole == 1) ? true : false
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
          identificativo: {
            title: 'Targa / Telaio',
            type: 'string'
          },
          marca: {
            title: 'Marca',
            type: 'html',
            filter: {
              type: 'list',
              config: {
                selectText: 'Tutti Brand',
                list: this.arrayBrand,
              },
            },
          },
          modello: {
            title: 'Modello',
            type: 'html',
            filter: {
              type: 'list',
              config: {
                selectText: 'Tutti Modelli',
                list: this.arrayModelli,
              },
            },
          },
          colore: {
            title: 'Colore mezzo',
            type: 'string'
          },
          info: {
            title: 'Note',
            type: 'string'
          }
        },
      };
    });
  }

  source: LocalDataSource = new LocalDataSource();

  loadingData = true;

  arrayBrand = [];
  arrayModelli = [];

  settings = {
    actions: {
      columnTitle: 'Azioni',
      position: 'right',
      delete: false
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
        compareFunction: (dir, a, b) => a >= b ? dir * 1 : dir * -1,
      },
      identificativo: {
        title: 'Targa / Telaio',
        type: 'string'
      },
      marca: {
        title: 'Marca',
        type: 'html',
        filter: {
          type: 'list',
          config: {
            selectText: 'Brand',
            list: this.arrayBrand,
          },
        },
      },
      modello: {
        title: 'Modello',
        type: 'html',
        filter: {
          type: 'list',
          config: {
            selectText: 'Modello',
            list: this.arrayModelli,
          },
        },
      },
      colore: {
        title: 'Colore mezzo',
        type: 'string'
      },
      info: {
        title: 'Note',
        type: 'string'
      }
    },
  };

  ngOnInit() {
    this.apiMezzo.getAll().subscribe(
      resp => {
        this.source.load(this.mezzoPipe.transform(resp));
        this.loadingData = false;
      }
    );
  }

  onCreate() {
    this.router.navigate(['/pages/mezzo/aggiungi']);
  }

  onEdit($event) {
    this.router.navigate(['/pages/mezzo/modifica/' + $event.data.id]);
  }

  onDelete($event) {
    this.dialogService.open(this.dialog, {context: $event}).onClose.subscribe(data => {
      if(data){
        this.apiMezzo.deleteMezzo($event.data.id).subscribe(() => {
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
