import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as env from 'src/environments/env';

@Component({
  selector: 'shared-lista-servizi-button',
  templateUrl: './lista-servizi-button.component.html',
  styleUrls: ['./lista-servizi-button.component.less']
})
export class ListaServiziButtonComponent implements OnInit {

  env = env;

  public value;

  constructor(private router: Router) { }

  ngOnInit() {
    if (this.value.servizi == 0) {
      this.value.servizi = '+';
    }
  }

  reroute() {
    if (this.value.servizi === '+') {
      this.router.navigate(['/pages/servizio/aggiungi/' + this.value.id]);
    } else {
      this.router.navigate(['/pages/servizio/lista/' + this.value.id]);
    }
  }

}
