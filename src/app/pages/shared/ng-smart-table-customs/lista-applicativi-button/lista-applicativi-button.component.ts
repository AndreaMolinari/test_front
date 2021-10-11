import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-applicativi-button',
  templateUrl: './lista-applicativi-button.component.html',
  styleUrls: ['./lista-applicativi-button.component.less']
})
export class ListaApplicativiButtonComponent implements OnInit {

  public value;
  applicativi = '';

  constructor() { }

  ngOnInit() { this.castApplicativi(this.value.applicativo); }

  castApplicativi(arrayApplicativi) {
    if (arrayApplicativi.length > 1) {
      for (let i = 1; i < arrayApplicativi.length; i++) {
        if (i === (arrayApplicativi.length - 1)) {
          this.applicativi = this.applicativi + arrayApplicativi[i].applicativo;
        } else {
          this.applicativi = this.applicativi + arrayApplicativi[i].applicativo + ', ';
        }
      }
    }
  }
}
