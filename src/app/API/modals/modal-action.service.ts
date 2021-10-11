import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalActionService {
  refreshTable: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  callRefreshTable(): void {
    this.refreshTable.emit();
  }
}
