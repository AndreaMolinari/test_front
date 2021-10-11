import { Component, OnInit } from '@angular/core';
import { TipologiaService } from 'src/app/API/tipologia/tipologia.service';
import { NbTreeGridDataSource, NbTreeGridDataSourceBuilder, NbGetters } from '@nebular/theme';

interface FSEntry {
  id: number;
  tipologia?: string;
  items?: number;
  children?: FSEntry[];
  expanded?: boolean;
}

@Component({
  selector: 'app-tipologia-lista',
  templateUrl: './tipologia-lista.component.html',
  styleUrls: ['./tipologia-lista.component.scss']
})
export class TipologiaListaComponent implements OnInit {

  loadingData: Boolean = true;

  customColumn = 'id';
  defaultColumns = ['tipologia', 'descrizione', 'items', 'azioni'];
  allColumns = [this.customColumn, ...this.defaultColumns];
  source: NbTreeGridDataSource<FSEntry>;

  private data: FSEntry[];

  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private _apiTipologia: TipologiaService,
  ) { }


  ngOnInit() {

    const getters: NbGetters<FSEntry, FSEntry> = {
      dataGetter: (node: FSEntry) => node,
      childrenGetter: (node: FSEntry) => node.children || undefined,
      expandedGetter: (node: FSEntry) => !!node.expanded,
    };

    this._apiTipologia.getAll().subscribe(
      data => {
        this.data = data;
        this.source = this.dataSourceBuilder.create(this.data, getters);
        this.loadingData = false;
      });
  }
}
