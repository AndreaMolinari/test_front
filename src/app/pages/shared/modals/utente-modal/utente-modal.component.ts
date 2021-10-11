import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { UtenteService } from 'src/app/API/utente/utente.service';
import { UtentePipe } from 'src/app/API/PIPES/utente/utente.pipe';
import * as env from 'src/environments/env';
import { Subscription } from 'rxjs';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'shared-utente-modal',
  templateUrl: './utente-modal.component.html',
  styleUrls: ['./utente-modal.component.less']
})
export class UtenteModalComponent implements OnInit, OnDestroy {
  @Input() idFlotta: number;

  loadingData = true;
  searchInput: FormControl = new FormControl('');

  tableData: any[] = [];
  selectedUsers: any[] = [];
  displayedColumns: string[] = ['checkbox', 'id', 'anagrafica', 'username'];
  tableVirtualSource = new TableVirtualScrollDataSource([]);

  // ? RUNTIME VARIABLES
  flottaUtenteAPI: Subscription;

  constructor(
    private ref: NbDialogRef<any>,
    private apiUtente: UtenteService,
    private utentePipe: UtentePipe
  ) { }

  ngOnInit(): void {
    this.getUsers();

    this.searchInput.valueChanges.pipe(
      debounceTime(250)
    ).subscribe(changes => this.tableVirtualSource.filter = changes.trim().toLowerCase());
  }

  getUsers(): void {
    this.loadingData = true;
    this.flottaUtenteAPI = this.apiUtente.getAll().subscribe({
      next: (resp) => {
        this.tableData = this.utentePipe.transform(resp);
        this.tableVirtualSource = new TableVirtualScrollDataSource(this.tableData);
        resp.forEach(user => Object.assign(this.selectedUsers, { [user.id]: false }));

        this.loadingData = false;
      },
      complete: () => this.flottaUtenteAPI.unsubscribe()
    });
  }

  selectUser(rowData): void {
    if (rowData.id) {
      this.selectedUsers[rowData.id] = !this.selectedUsers[rowData.id];
    } else {
      console.error('Non è stato possibile selezionare la riga!');
    }
  }

  onSubmit(): void {
    const idSelezionati = Object.keys(this.selectedUsers).filter(val => this.selectedUsers[val] === true);
    const utentiSelezionati = this.tableData.filter(val => idSelezionati.includes(val.id.toString()));
    this.loadingData = true;
    this.ref.close(utentiSelezionati);
  }

  ngOnDestroy(): void {
    if (this.flottaUtenteAPI) {
      this.flottaUtenteAPI.unsubscribe();
      if (environment.debug) {
        console.warn('Distruggo la chiamata Utente');
      }
    }
  }

}
