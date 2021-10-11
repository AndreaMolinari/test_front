import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { ComponenteService } from 'src/app/API/componente/componente.service';
import { SimPipe } from 'src/app/API/PIPES/sim/sim.pipe';
import { SimService } from 'src/app/API/sim/sim.service';

@Component({
  selector: 'app-sim-massiva',
  templateUrl: './sim-massiva.component.html',
  styleUrls: ['./sim-massiva.component.less']
})

export class SimMassivaComponent implements OnInit {

  arraySim = [];
  componentiGiaInseriti = [];

  source: LocalDataSource = new LocalDataSource();

  loadingData = true;

  settings = {
    actions: {
      columnTitle: 'Azioni',
      position: 'right',
      add: false,
      edit: false,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
    },
    noDataMessage: 'Per iniziare carica un file...',
    pager: {
      perPage: 10
    },
    mode: 'external',
    columns: {
      unitcode: {
        title: 'Unitcode',
        type: 'text'
      },
      modelloGPS: {
        title: 'idModello',
        type: 'text',
        width: '0'
      },
      serial: {
        title: 'Seriale SIM',
        type: 'text'
      },
      modelloSIM: {
        title: 'idModello',
        type: 'text',
        width: '0'
      }
    },
  };

  constructor(
    private apiComponente: ComponenteService,
    private simPipe: SimPipe,
    private toastrService: NbToastrService) { }

  ngOnInit() {
    this.settings['rowClassFunction'] = (row) => {
      const index = this.componentiGiaInseriti.findIndex($ => {
        if (this.arraySim[$] !== undefined) {
          return this.arraySim[$].unitcode === row.data.unitcode;
        }
      });
      if (index !== -1) {
        // return 'danger';
        return '';
      }
      return '';
    };
  }

  loadFile($event) {
    const file = $event.target.files[0];

    const fileReader = new FileReader();
    fileReader.onload = ($) => {
      this.arraySim = this.simPipe.formatMassiveInsert(fileReader.result);
      this.source.load(this.simPipe.formatMassiveTable(this.arraySim));
    };

    fileReader.readAsText(file);
  }

  onDelete($event): void {
    const findIndex = this.arraySim.findIndex(ele => ele.unitcode === $event.unitcode);
    if (findIndex !== -1) {

      // const index = this.componentiGiaInseriti.findIndex($ => this.arraySim[$].unitcode === $event.unitcode);
      // if (index !== -1) { this.componentiGiaInseriti.splice(index, 1); }

      this.arraySim.splice(findIndex, 1);
      this.source.load(this.simPipe.formatMassiveTable(this.arraySim));
    }
  }

  submit() {
    this.apiComponente.addComponenteMassivo(this.arraySim).subscribe(resp => {
      this.toastrService.success('L inserimento massivo è andato a buon fine...', 'OK!', { icon: 'globe' });
    }, error => {
      this.toastrService.danger('Qualcosa durante l inserimento massivo è andato male...', 'ERRORE SERVER!', { icon: 'globe' });
      if (error.status === 422) {
        this.componentiGiaInseriti = [];
        Object.keys(error.error.errors).forEach((key, value) => {
          this.componentiGiaInseriti.push(key.split('.')[0]);
        });
      }
    });
  }

}
