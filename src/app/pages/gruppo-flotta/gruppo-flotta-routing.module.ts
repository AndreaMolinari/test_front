import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GruppoFlottaComponent } from './gruppo-flotta.component';
import { GruppoFlottaAggiungiComponent } from './gruppo-flotta-aggiungi/gruppo-flotta-aggiungi.component';
import { GruppoFlottaListaComponent } from './gruppo-flotta-lista/gruppo-flotta-lista.component';


const routes: Routes = [
  {
    path: '',
    component: GruppoFlottaComponent,
    children: [
      {
        path: 'aggiungi',
        component: GruppoFlottaAggiungiComponent
      },
      {
        path: 'modifica/:id',
        component: GruppoFlottaAggiungiComponent
      },
      {
        path: 'lista',
        component: GruppoFlottaListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GruppoFlottaRoutingModule { }
