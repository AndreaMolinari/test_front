import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { ComponenteService } from 'src/app/API/componente/componente.service';
import { ComponentePipe } from 'src/app/API/PIPES/componente/componente.pipe';
import { BrandPipe } from 'src/app/API/PIPES/brand/brand.pipe';
import { BrandService } from 'src/app/API/brand/brand.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import * as globals from 'src/environments/globals';

@Component({
  selector: 'app-componente-lista',
  templateUrl: './componente-lista.component.html',
  styleUrls: ['./componente-lista.component.less']
})

export class ComponenteListaComponent implements OnInit {

  @ViewChild('dialog') private dialog: TemplateRef<any>;

  arrayModelli = [];
  arrayBrand = [];

  constructor(
    private apiComponente: ComponenteService,
    private apiBrand: BrandService,
    private brandPipe: BrandPipe,
    private componentePipe: ComponentePipe,
    private router: Router,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService) {

    this.apiBrand.filterByTipologia(65).subscribe(resp => {
      this.arrayModelli = [];
      this.arrayBrand = this.brandPipe.transformNGSelect(resp);
      resp.forEach(brand => {
        this.componentePipe.transformNGSelect(brand.modelli).forEach(modello => {
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
    });
    setTimeout(() => {
      this.settings = {
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
            compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1,
          },
          unitcode: {
            title: 'Codice unità',
            type: 'string'
          },
          marca: {
            title: 'Brand',
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
          sim: {
            title: 'SIM',
            type: 'text'
          }
        },
      };
    }, 1500);
  }

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
        compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1,
      },
      unitcode: {
        title: 'Codice unità',
        type: 'string'
      },
      marca: {
        title: 'Brand',
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
      sim: {
        title: 'SIM',
        type: 'text'
      }
    },
  };

  ngOnInit() {
    this.apiComponente.getAll().subscribe(
      data => {
        this.source.load(this.componentePipe.transform(data));
        this.loadingData = false;
      });
  }

  onCreate() {
    this.router.navigate(['/pages/componente/aggiungi']);
  }

  onMassiveCreate() {
    this.router.navigate(['/pages/sim/aggiungi/massiva']);
  }

  onEdit($event) {
    this.router.navigate(['/pages/componente/modifica/' + $event.data.id]);
  }

  onDelete($event) {
    this.loadingData = true;
    this.apiComponente.deleteComponente($event.data.id, false).subscribe(
      () => {
        this.loadingData = false;
        this.source.remove($event.data);
        this.toastrService.success('Il componente è stato eliminato con successo...', 'OK!');
      }, error => {
        this.loadingData = false;
        this.toastrService.danger('Qualcosa è andato storico durante l eliminazione...', 'ERRORE SERVER!');
        if (error.status === 422) {
          this.dialogService.open(this.dialog)
            .onClose.subscribe(data => {
              if (data) {
                this.loadingData = true;
                this.apiComponente.deleteComponente($event.data.id, true).subscribe(() => {
                  this.loadingData = false;
                  this.source.remove($event.data);
                  this.toastrService.success('Il componente è stato eliminato con successo...', 'OK!');
                }, () => {
                  this.loadingData = false;
                  this.toastrService.danger('Qualcosa è andato storico durante l eliminazione...', 'ERRORE SERVER!');
                });
              } else {
                this.toastrService.info('Il componente è rimasto invariato!', 'Info');
              }
            });
        }
      });
  }

}
