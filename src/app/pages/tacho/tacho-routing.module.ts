import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TachoAggiungiComponent } from './tacho-aggiungi/tacho-aggiungi.component';
import { TachoListaComponent } from './tacho-lista/tacho-lista.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'lista',
    pathMatch: 'full'
  },
  {
    path: 'aggiungi',
    component: TachoAggiungiComponent
  },
  {
    path: 'modifica/:id',
    component: TachoAggiungiComponent
  },
  {
    path: 'lista',
    component: TachoListaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TachoRoutingModule { }
