import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-checkbox-flotta',
  templateUrl: './lista-checkbox-flotta.component.html',
  styleUrls: ['./lista-checkbox-flotta.component.less']
})
export class ListaCheckboxFlottaComponent implements OnInit {

  public value;
  checkboxValue;

  constructor() { }

  ngOnInit() {
    if (this.value.principale == 1) {
      this.checkboxValue = true;
    } else { this.checkboxValue = false; }
  }

}
