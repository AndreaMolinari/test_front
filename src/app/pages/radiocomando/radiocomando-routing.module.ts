import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RadiocomandoComponent } from './radiocomando.component';
import { RadiocomandoAggiungiComponent } from './radiocomando-aggiungi/radiocomando-aggiungi.component';
import { RadiocomandoListaComponent } from './radiocomando-lista/radiocomando-lista.component';


const routes: Routes = [
  {
    path: '',
    component: RadiocomandoComponent,
    children: [
      {
        path: 'aggiungi',
        component: RadiocomandoAggiungiComponent
      },
      {
        path: 'modifica/:id',
        component: RadiocomandoAggiungiComponent
      },
      {
        path: 'lista',
        component: RadiocomandoListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RadiocomandoRoutingModule { }
