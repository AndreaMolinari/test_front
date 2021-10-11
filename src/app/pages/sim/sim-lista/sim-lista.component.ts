import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { SimService } from 'src/app/API/sim/sim.service';
import { SimPipe } from 'src/app/API/PIPES/sim/sim.pipe';
import { ModelloService } from 'src/app/API/modello/modello.service';
import { BrandPipe } from 'src/app/API/PIPES/brand/brand.pipe';
import { ComponentePipe } from 'src/app/API/PIPES/componente/componente.pipe';
import { BrandService } from 'src/app/API/brand/brand.service';

@Component({
  selector: 'app-sim-lista',
  templateUrl: './sim-lista.component.html',
  styleUrls: ['./sim-lista.component.less']
})
export class SimListaComponent implements OnInit {

  constructor(
    private apiSIM: SimService,
    private simPipe: SimPipe,
    private apiBrand: BrandService,
    private router: Router,
    private componentePipe: ComponentePipe,
    private brandPipe: BrandPipe
  ) {

    this.apiBrand.filterByTipologia(11).subscribe(resp => {
      this.arrayModelli = [];
      this.arrayBrand = this.brandPipe.transformNGSelect(resp);
      resp.forEach(brand => {
        this.componentePipe.transformNGSelect(brand.modelli).forEach(modello => {
          this.arrayModelli.push(modello);
        });
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
          serial: {
            title: 'Seriale',
            type: 'string'
          },
          apn: {
            title: 'APN',
            type: 'string'
          },
          marca: {
            title: 'Brand',
            type: 'html',
            filter: {
              type: 'list',
              config: {
                selectText: 'Tutti i brand',
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
                selectText: 'Tutti i modelli',
                list: this.arrayModelli,
              },
            },
          }
        },
      };
    }, 1500);
  }

  arrayModelli = [];
  arrayBrand = [];

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
      serial: {
        title: 'Seriale',
        type: 'string'
      },
      apn: {
        title: 'APN',
        type: 'string'
      },
      marca: {
        title: 'Brand',
        type: 'html',
        filter: {
          type: 'list',
          config: {
            selectText: 'Tutti i brand',
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
            selectText: 'Tutti i modelli',
            list: this.arrayModelli,
          },
        },
      }
    },
  };

  ngOnInit() {
    this.apiSIM.getAll().subscribe(
      data => {
        this.source.load(this.simPipe.transform(data));
        this.loadingData = false;
      })
  }

  onCreate() {
    this.router.navigate(['/pages/sim/aggiungi']);
  }

  onMassiveCreate() {
    this.router.navigate(['/pages/sim/aggiungi/massiva']);
  }

  onEdit($event) {
    this.router.navigate(['/pages/sim/modifica/' + $event.data.id]);
  }

  onDelete($event) {
    this.loadingData = true;
    this.apiSIM.deleteSim($event.cells[0].value).subscribe(
      data => {
        this.source.remove($event.data);
        this.loadingData = false;
      }
    );
  }

}
