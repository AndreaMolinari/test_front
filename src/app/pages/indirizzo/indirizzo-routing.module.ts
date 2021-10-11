import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndirizzoComponent } from './indirizzo.component';
import { IndirizzoAggiungiComponent } from './indirizzo-aggiungi/indirizzo-aggiungi.component';
import { IndirizzoListaComponent } from './indirizzo-lista/indirizzo-lista.component';


const routes: Routes = [
  {
    path: '',
    component: IndirizzoComponent,
    children: [
      {
        path: 'aggiungi',
        component: IndirizzoAggiungiComponent,
      },
      {
        path: 'modifica/:id',
        component: IndirizzoAggiungiComponent
      },
      {
        path: 'lista',
        component: IndirizzoListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndirizzoRoutingModule { }
