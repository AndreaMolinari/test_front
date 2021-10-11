import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ServizioService } from 'src/app/API/servizio/servizio.service';
import { ServizioPipe } from 'src/app/API/PIPES/servizio/servizio.pipe';
import { Subscription } from 'rxjs';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface RowState {
  [key: number]: boolean;
}

@Component({
  selector: 'app-servizio-modal',
  templateUrl: './new-servizio-modal.component.html',
  styleUrls: ['./new-servizio-modal.component.less']
})

export class NewServizioModalComponent implements OnInit, OnDestroy {
  @Input() idFlotta: number = null;

  loadingData = true;
  searchInput: FormControl = new FormControl('');

  datiTabella: any[] = [];
  selectedServices: RowState = {};
  displayedColumns: string[] = ['checkbox', 'id', 'anagrafica', 'dataInzio', 'dataFine', 'veicolo', 'periferica', 'tachigrafo'];
  tableVirtualSource = new TableVirtualScrollDataSource([]);

  // ? RUNTIME VARIABLES
  flottaServizioAPI: Subscription;

  constructor(
    private ref: NbDialogRef<any>,
    private apiServizio: ServizioService,
    private servizioPipe: ServizioPipe,
    public cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getServices();

    this.searchInput.valueChanges.pipe(
      debounceTime(250)
    ).subscribe(changes => this.tableVirtualSource.filter = changes.trim().toLowerCase());
  }

  getServices(): void {
    this.flottaServizioAPI = this.apiServizio.getServiziNonInFlotta((this.idFlotta) ? '/' + this.idFlotta : '').subscribe({
      next: (resp) => {
        this.datiTabella = this.servizioPipe.transform(resp);
        this.tableVirtualSource = new TableVirtualScrollDataSource(this.datiTabella);
        resp.forEach(service => Object.assign(this.selectedServices, { [service.id]: false }));

        this.loadingData = false;
      },
      complete: () => this.flottaServizioAPI.unsubscribe()
    });
  }

  selectService(rowData): void {
    if (rowData.id) {
      this.selectedServices[rowData.id] = !this.selectedServices[rowData.id];
    } else {
      console.error('Non è stato possibile selezionare la riga!');
    }
  }

  onSubmit(): void {
    const idSelezionati = Object.keys(this.selectedServices).filter(val => this.selectedServices[val] === true);
    const serviziSelezionati = this.datiTabella.filter(val => idSelezionati.includes(val.id.toString()));
    this.loadingData = true;
    this.ref.close(serviziSelezionati);
  }

  ngOnDestroy(): void {
    if (this.flottaServizioAPI) {
      this.flottaServizioAPI.unsubscribe();
      if (environment.debug) {
        console.warn('Distruggo la chiamata Flotta');
      }
    }
  }

}
