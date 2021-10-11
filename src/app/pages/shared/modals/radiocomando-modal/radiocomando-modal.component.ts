import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { RadiocomandoPipe } from 'src/app/API/PIPES/radiocomando/radiocomando.pipe';
import { RadiocomandoService } from 'src/app/API/radiocomando/radiocomando.service';
import { environment } from 'src/environments/environment';

interface RowState {
  [key: number]: boolean;
}

@Component({
  selector: 'app-radiocomando-modal',
  templateUrl: './radiocomando-modal.component.html',
  styleUrls: ['./radiocomando-modal.component.less']
})
export class RadiocomandoModalComponent implements OnInit, OnDestroy {
  loadingData = true;
  searchInput: FormControl = new FormControl('');

  datiTabella: any[] = [];
  selectedServices: RowState = {};
  displayedColumns: string[] = ['checkbox', 'id', 'unitcode', 'brand', 'modello'];
  tableVirtualSource = new TableVirtualScrollDataSource([]);

  // ? RUNTIME VARIABLES
  radiocomandoAPI: Subscription;

  constructor(
    private ref: NbDialogRef<any>,
    public cdr: ChangeDetectorRef,
    private apiRadiocomando: RadiocomandoService,
    private radiocomandoPipe: RadiocomandoPipe
  ) { }

  ngOnInit(): void {
    this.getComponents();

    this.searchInput.valueChanges.pipe(
      debounceTime(250)
    ).subscribe(changes => this.tableVirtualSource.filter = changes.trim().toLowerCase());
  }

  getComponents(): void {
    this.radiocomandoAPI = this.apiRadiocomando.getNONASSOCIATO().subscribe({
      next: (resp) => {
        this.datiTabella = this.radiocomandoPipe.tranformGETall(resp);
        this.tableVirtualSource = new TableVirtualScrollDataSource(this.datiTabella);
        resp.forEach(service => Object.assign(this.selectedServices, { [service.id]: false }));
        this.loadingData = false;
      },
      complete: () => this.radiocomandoAPI.unsubscribe()
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
    if (this.radiocomandoAPI) {
      this.radiocomandoAPI.unsubscribe();
      if (environment.debug) {
        console.warn('Distruggo la chiamata radiocomando');
      }
    }
  }

}
