import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MezzoComponent } from './mezzo.component';
import { MezzoAggiungiComponent } from './mezzo-aggiungi/mezzo-aggiungi.component';
import { MezzoListaComponent } from './mezzo-lista/mezzo-lista.component';


const routes: Routes = [
  {
    path: '',
    component: MezzoComponent,
    children: [
      {
        path: 'aggiungi',
        component: MezzoAggiungiComponent
      },
      {
        path: 'modifica/:id',
        component: MezzoAggiungiComponent
      },
      {
        path: 'lista',
        component: MezzoListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MezzoRoutingModule { }
