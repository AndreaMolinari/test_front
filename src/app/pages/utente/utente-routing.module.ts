import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UtenteComponent } from './utente.component';
import { UtenteListaComponent } from './utente-lista/utente-lista.component';
import { UtenteAggiungiComponent } from './utente-aggiungi/utente-aggiungi.component';


const routes: Routes = [
  {
    path: '',
    component: UtenteComponent,
    children: [
      {
        path: 'aggiungi',
        component: UtenteAggiungiComponent
      },
      {
        path: 'modifica/:id',
        component: UtenteAggiungiComponent
      },
      {
        path: 'dettaglio/:id',
        component: UtenteAggiungiComponent
      },
      {
        path: 'lista',
        component: UtenteListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UtenteRoutingModule { }
