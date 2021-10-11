import { Component, OnInit, AfterViewChecked, ChangeDetectorRef, ViewChild, OnDestroy } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ServizioService } from 'src/app/API/servizio/servizio.service';
import { ServizioPipe } from 'src/app/API/PIPES/servizio/servizio.pipe';
import { LocalDataSource } from 'ng2-smart-table';
import { Ng2SmartTableComponent } from 'ng2-smart-table/lib/ng2-smart-table.component';
import { isArray } from 'util';

@Component({
  selector: 'shared-servizio-modal',
  templateUrl: './servizio-modal.component.html',
  styleUrls: ['./servizio-modal.component.less']
})

export class ServizioModalComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('table', { static: true }) table: Ng2SmartTableComponent;

  loadingData: boolean;

  caricaAltri = false;
  datiTabella;
  indiceReload = 20;

  source: LocalDataSource = new LocalDataSource();
  servizio = [];

  settings = {
    actions: false,
    selectMode: 'multi',
    add: false,
    edit: false,
    delete: false,
    select: true,
    pager: {
      display: true,
      perPage: 20
    },
    columns: {
      id: {
        title: 'ID',
        type: 'text',
        compareFunction: (dir, a, b) => +a >= +b ? dir * 1 : dir * -1
      },
      anagrafica: {
        title: 'Anagrafica',
        type: 'text'
      },
      dataInizio: {
        title: 'Data Inizio',
        type: 'html'
      },
      dataFine: {
        title: 'Data Fine',
        type: 'html'
      },
      veicolo: {
        title: 'Mezzo',
        type: 'text',
      },
      periferica: {
        title: 'Componente',
        type: 'text'
      },
      tachigrafo: {
        title: 'Tachigrafo',
        type: 'text'
      }
    }
  };

  idFlottaURL: number = null;

  // ? runtime variables
  flottaServizioAPI;

  constructor(
    private ref: NbDialogRef<any>,
    private apiServizio: ServizioService,
    private servizioPipe: ServizioPipe,
    public cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // this.modalOperations.getIDflotta.subscribe(data => {
    //   this.idFlottaURL = data;
    //   this.loadDataTable();
    // });
    this.loadDataTable();
    this.loadingData = true;
  }

  ngAfterViewChecked(): void {
    this.syncTable();
  }

  loadDataTable() {
    this.flottaServizioAPI = this.apiServizio.getServiziNonInFlotta((this.idFlottaURL !== null)
      ? '/' + this.idFlottaURL : '').subscribe(data => {
        this.source.load(this.servizioPipe.transform(data));
        this.loadingData = false;
      });
  }

  aggiornaDatiLista() {
    this.source.setPaging(1, this.indiceReload);

    this.caricaAltri = false;
    this.indiceReload = this.indiceReload + 10;
  }

  onScroll($event) {
    if (!this.caricaAltri) {
      const scrollAvaible = $event.target.scrollHeight;
      const myBodyHeight = $event.target.offsetHeight; // ?Dopo di questa carico la lista
      const scrollAttuale = $event.target.scrollTop;

      const maxOffset = (scrollAvaible - myBodyHeight) * 0.80;

      if (scrollAttuale > maxOffset) {
        console.log('Loading...');
        this.caricaAltri = true;
        this.aggiornaDatiLista();
      }
    }
  }

  onUserRowSelect($event) {
    if ($event.isSelected == null && isArray($event.selected)) {

      $event.selected.forEach(row => {
        const index = this.servizio.findIndex(element => element === row);
        if (index === -1) {
          this.servizio.push(row);
        }
      });

    } else if ($event.isSelected === true) {

      const index = this.servizio.findIndex(element => element === $event.data);
      if (index === -1) {
        this.servizio.push($event.data);
      }

    } else {

      const index = this.servizio.findIndex(element => element === $event.data);
      this.servizio.splice(index, 1);

    }
  }

  syncTable() {
    this.table.grid.getRows().forEach((row: any) => {
      if (this.servizio.find(r => r.id === row.data.id)) {
        row.isSelected = true;
      }
    });

    this.cdr.detectChanges();
  }

  onSubmit() {
    this.loadingData = true;
    this.ref.close(this.servizio);
  }

  ngOnDestroy() {
    if (this.flottaServizioAPI) { this.flottaServizioAPI.unsubscribe(); console.warn('Distruggo la chiamata Flotta'); }
  }

}
