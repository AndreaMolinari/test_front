import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandComponent } from './brand.component';
import { BrandAggiungiComponent } from './brand-aggiungi/brand-aggiungi.component';
import { BrandListaComponent } from './brand-lista/brand-lista.component';


const routes: Routes = [
  {
    path: '',
    component: BrandComponent,
    children: [
      {
        path: 'aggiungi',
        component: BrandAggiungiComponent
      },
      {
        path: 'modifica/:id',
        component: BrandAggiungiComponent
      },
      {
        path: 'lista',
        component: BrandListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandRoutingModule { }
