import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { BrandService } from 'src/app/API/brand/brand.service';
import { BrandPipe } from 'src/app/API/PIPES/brand/brand.pipe';
import { ComponentePipe } from 'src/app/API/PIPES/componente/componente.pipe';
import { RadiocomandoService } from 'src/app/API/radiocomando/radiocomando.service';

@Component({
  selector: 'app-radiocomando-lista',
  templateUrl: './radiocomando-lista.component.html',
  styleUrls: ['./radiocomando-lista.component.less']
})

export class RadiocomandoListaComponent implements OnInit {

  arrayModelli = [];
  arrayBrand = [];

  constructor(
    private apiRadiocomando: RadiocomandoService,
    private apiBrand: BrandService,
    private brandPipe: BrandPipe,
    private componentePipe: ComponentePipe,
    private router: Router,
    private toastrService: NbToastrService
  ) {

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
          }
        },
      };
    });
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
      }
    },
  };

  ngOnInit(): void {
    this.apiRadiocomando.getAll().subscribe(
      data => {
        this.source.load(this.componentePipe.transform(data));
        this.loadingData = false;
      });
  }

  onCreate(): void {
    this.router.navigate(['/pages/radiocomando/aggiungi']);
  }

  onEdit($event): void {
    this.router.navigate(['/pages/radiocomando/modifica/' + $event.data.id]);
  }

  onDelete($event): void {
    this.toastrService.danger('Questa funzione al momento risulta non disponibile', '');
  }
}