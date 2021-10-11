import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

export interface ContextModalData {
  operazione: string;
  origine: string;
  errorsList: Error[];
}

export interface Error {
  icona: string;
  titolo: string;
  motivo: string;
}

@Component({
  selector: 'app-elenco-errori',
  templateUrl: './elenco-errori.component.html',
  styleUrls: ['./elenco-errori.component.less']
})
export class ElencoErroriComponent implements OnInit {
  @Input() contextData: ContextModalData;

  displayedColumns: string[] = ['icona', 'titolo', 'motivo'];

  constructor(
    public ref: NbDialogRef<any>,
    public location: Location
  ) { }

  ngOnInit(): void { }

}
