import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DdtComponent } from './ddt.component';
import { DdtAggiungiComponent } from './ddt-aggiungi/ddt-aggiungi.component';
import { DdtListaComponent } from './ddt-lista/ddt-lista.component';


const routes: Routes = [
  {
    path: '',
    component: DdtComponent,
    children: [
      {
        path: 'aggiungi',
        component: DdtAggiungiComponent
      },
      {
        path: 'modifica/:id',
        component: DdtAggiungiComponent
      },
      {
        path: 'lista',
        component: DdtListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DdtRoutingModule { }
