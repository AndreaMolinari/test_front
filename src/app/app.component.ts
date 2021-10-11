import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SwUpdate } from '@angular/service-worker';
import * as env from 'src/environments/env';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'WebGest';

  constructor(private serviceWorker: SwUpdate) {
    serviceWorker.available.subscribe(event => {
    });
    serviceWorker.available.subscribe(event => {
      console.log('Versione attuale', event.current);
      console.log('Ultima versione', event.available);
      window.location.reload();
      alert("WebGest si è aggiornato all'ultima versione!");
    });
  }
}
// enableProdMode();
