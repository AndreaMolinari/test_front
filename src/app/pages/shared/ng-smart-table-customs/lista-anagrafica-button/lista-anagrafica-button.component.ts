import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'shared-lista-anagrafica-button',
  templateUrl: './lista-anagrafica-button.component.html',
  styleUrls: ['./lista-anagrafica-button.component.less']
})
export class ListaAnagraficaButtonComponent implements OnInit {

  public value;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  reroute() {
    this.router.navigate(['/pages/anagrafica/modifica/' + this.value.idAnagrafica]);
  }

}
