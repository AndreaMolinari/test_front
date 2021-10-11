import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServizioComponent } from './servizio.component';
import { ServizioAggiungiComponent } from './servizio-aggiungi/servizio-aggiungi.component';
import { ServizioListaComponent } from './servizio-lista/servizio-lista.component';


const routes: Routes = [
  {
    path: '',
    component: ServizioComponent,
    children: [
      {
        path: 'aggiungi',
        component: ServizioAggiungiComponent
      },
      {
        path: 'aggiungi/:idAnagrafica',
        component: ServizioAggiungiComponent
      },
      {
        path: 'duplicated/:idOrigine',
        component: ServizioAggiungiComponent
      },
      {
        path: 'modifica/:id',
        component: ServizioAggiungiComponent
      },
      {
        path: 'modifica/:idAnagrafica/:id',
        component: ServizioAggiungiComponent
      },
      {
        path: 'lista',
        component: ServizioListaComponent
      },
      {
        path: 'listaAttivi',
        component: ServizioListaComponent
      },
      {
        path: 'listaScaduti',
        component: ServizioListaComponent
      },
      {
        path: 'listaFuturi',
        component: ServizioListaComponent
      },
      {
        path: 'lista/:id',
        component: ServizioListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServizioRoutingModule { }
