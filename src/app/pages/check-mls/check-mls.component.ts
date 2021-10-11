import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { LocalDataSource } from 'ng2-smart-table';
import { MlsService } from 'src/app/API/mls/mls.service';
import { TipologiaService } from 'src/app/API/tipologia/tipologia.service';
import { ListaAnagraficaButtonComponent } from '../shared/ng-smart-table-customs/lista-anagrafica-button/lista-anagrafica-button.component';

@Component({
  selector: 'app-check-mls',
  templateUrl: './check-mls.component.html',
  styleUrls: ['./check-mls.component.less']
})

export class CheckMLSComponent implements OnInit {

  settings = {
    actions: {
      columnTitle: 'Azioni',
      position: 'right',
      add: false,
      edit: false,
      delete: false
    },
    noDataMessage: 'Nessun dato trovato per i seguenti filtri...',
    pager: false,
    columns: {
      idAnagrafica: {
        title: 'ID',
        type: 'text',
        compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1,
      },
      denominazione: {
        title: 'Nome anagrafica',
        type: 'custom',
        valuePrepareFunction: (cell, row) => row,
        renderComponent: ListaAnagraficaButtonComponent
      },
      username: {
        title: 'Username',
        type: 'text'
      },
      created_at: {
        title: 'Data creazione',
        type: 'text',
        valuePrepareFunction: (cell, row) => {
          if (cell) {
            return this.datePipe.transform(cell, 'dd/MM/yyyy HH:mm')
          } else {
            return '--';
          }
        }
      }
    }
  };
  source: LocalDataSource = new LocalDataSource();

  arrayTipologie = [];

  loading = false;

  filters: FormGroup = this.fb.group({
    idTipologia: [112, Validators.required],
    idRivenditore: [40, Validators.required],
    created_before: [null],
    created_after: [null]
  });

  constructor(
    private fb: FormBuilder,
    private mlsService: MlsService,
    private tipologiaService: TipologiaService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    this.getTipologie();
    this.search();
  }

  getTipologie(): void {
    this.tipologiaService.filterByID(2).subscribe(resp => {
      this.arrayTipologie = resp.all_children;
    });
  }

  search(): void {
    this.loading = true;
    this.filters.value.created_before = this.datePipe.transform(this.filters.value.created_before, 'yyyy-MM-dd');
    this.filters.value.created_after = this.datePipe.transform(this.filters.value.created_after, 'yyyy-MM-dd');
    console.log(this.filters.value);
    this.mlsService.filterList(this.filters.value).subscribe(resp => {
      this.source.load(resp);
      this.loading = false;
    });
  }

  downloadCSV() {
    const now = this.datePipe.transform(new Date(), 'dd-MM-yyyy_hh-mm-ss');
    const options = {
      showLabels: true,
      showTitle: true,
      title: 'Report_attivazioni_MLS ' + now,
      useBom: true,
      nullToEmptyString: true,
      headers: [
        'ID',
        'Cliente',
        'Username',
        'Creato il'
      ]
    };
    const exportfile = new Angular5Csv(this.castXExport(this.source['data']), 'Report_attivazioni_MLS ' + now, options);
  }

  castXExport(input: any[]): object[] {
    const newArray = [];
    input.forEach(row => {
      newArray.push({
        idAnagrafica: row.idAnagrafica,
        denominazione: row.denominazione,
        username: row.username,
        created_at: row.created_at
      });
    });

    return newArray;
  }

}
