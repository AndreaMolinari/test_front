import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdiniComponent } from './ordini.component';
import { OrdiniAggiungiComponent } from './ordini-aggiungi/ordini-aggiungi.component';
import { OrdiniListaComponent } from './ordini-lista/ordini-lista.component';


const routes: Routes = [
  {
    path: '',
    component: OrdiniComponent,
    children: [
      {
        path: 'aggiungi',
        component: OrdiniAggiungiComponent
      },
      {
        path: 'modifica/:id',
        component: OrdiniAggiungiComponent
      },
      {
        path: 'lista',
        component: OrdiniListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdiniRoutingModule { }
