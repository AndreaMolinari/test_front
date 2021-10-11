import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FatturazioneComponent } from './fatturazione.component';
import { FatturazioneAggiungiComponent } from './fatturazione-aggiungi/fatturazione-aggiungi.component';
import { FatturazioneListaComponent } from './fatturazione-lista/fatturazione-lista.component';


const routes: Routes = [
  {
    path: '',
    component: FatturazioneComponent,
    children: [
      {
        path: 'aggiungi',
        component: FatturazioneAggiungiComponent
      },
      {
        path: 'modifica/:id',
        component: FatturazioneAggiungiComponent
      },
      {
        path: 'lista',
        component: FatturazioneListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FatturazioneRoutingModule { }
