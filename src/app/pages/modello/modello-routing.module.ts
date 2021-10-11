import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModelloComponent } from './modello.component';
import { ModelloAggiungiComponent } from './modello-aggiungi/modello-aggiungi.component';
import { ModelloListaComponent } from './modello-lista/modello-lista.component';


const routes: Routes = [
  {
    path: '',
    component: ModelloComponent,
    children: [
      {
        path: 'aggiungi',
        component: ModelloAggiungiComponent
      },
      {
        path: 'modifica/:id',
        component: ModelloAggiungiComponent
      },
      {
        path: 'lista',
        component: ModelloListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModelloRoutingModule { }
