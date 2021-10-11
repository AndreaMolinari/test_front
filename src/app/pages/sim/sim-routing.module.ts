import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SimComponent } from './sim.component';
import { SimAggiungiComponent } from './sim-aggiungi/sim-aggiungi.component';
import { SimListaComponent } from './sim-lista/sim-lista.component';
import { SimMassivaComponent } from './sim-massiva/sim-massiva.component';


const routes: Routes = [
  {
    path: '',
    component: SimComponent,
    children: [
      {
        path: 'aggiungi',
        component: SimAggiungiComponent
      },
      {
        path: 'aggiungi/massiva',
        component: SimMassivaComponent
      },
      {
        path: 'modifica/:id',
        component: SimAggiungiComponent
      },
      {
        path: 'lista',
        component: SimListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimRoutingModule { }
