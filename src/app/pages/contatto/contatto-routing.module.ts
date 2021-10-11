import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContattoComponent } from './contatto.component';
import { ContattoAggiungiComponent } from './contatto-aggiungi/contatto-aggiungi.component';
import { ContattoListaComponent } from './contatto-lista/contatto-lista.component';


const routes: Routes = [
  {
    path: '',
    component: ContattoComponent,
    children: [
      {
        path: 'aggiungi',
        component: ContattoAggiungiComponent,
      },
      {
        path: 'modifica/:id',
        component: ContattoAggiungiComponent
      },
      {
        path: 'lista',
        component: ContattoListaComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContattoRoutingModule { }
