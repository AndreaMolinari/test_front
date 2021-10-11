import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ComponenteComponent } from './componente.component';
import { ComponenteAggiungiComponent } from './componente-aggiungi/componente-aggiungi.component';
import { ComponenteListaComponent } from './componente-lista/componente-lista.component';


const routes: Routes = [
  {
    path: '',
    component: ComponenteComponent,
    children: [
      {
        path: 'aggiungi',
        component: ComponenteAggiungiComponent
      },
      {
        path: 'modifica/:id',
        component: ComponenteAggiungiComponent
      },
      {
        path: 'lista',
        component: ComponenteListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComponenteRoutingModule { }
