import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TipologiaComponent } from './tipologia.component';
import { TipologiaAggiungiComponent } from './tipologia-aggiungi/tipologia-aggiungi.component';
import { TipologiaListaComponent } from './tipologia-lista/tipologia-lista.component';


const routes: Routes = [
  {
    path: '',
    component: TipologiaComponent,
    children: [
      {
        path: 'aggiungi',
        component: TipologiaAggiungiComponent
      },
      {
        path: 'modifica/:id',
        component: TipologiaAggiungiComponent
      },
      {
        path: 'lista',
        component: TipologiaListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipologiaRoutingModule { }
