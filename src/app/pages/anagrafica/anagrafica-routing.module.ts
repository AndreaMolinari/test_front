import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnagraficaComponent } from './anagrafica.component';
import { AnagraficaAggiungiComponent } from './anagrafica-aggiungi/anagrafica-aggiungi.component';
import { AnagraficaListaComponent } from './anagrafica-lista/anagrafica-lista.component';


const routes: Routes = [
  {
    path: '',
    component: AnagraficaComponent,
    children: [
      {
        path: 'aggiungi',
        component: AnagraficaAggiungiComponent
      },{
        path: 'aggiungi/:idTipo',
        component: AnagraficaAggiungiComponent
      },{
        path: 'modifica/:id',
        component: AnagraficaAggiungiComponent
      },{
        path: 'relazione/:idRela',
        component: AnagraficaAggiungiComponent
      },
      
      {
        path: 'lista/cliente',
        component: AnagraficaListaComponent,
        data: {idTipologia: 12}
      },{
        path: 'lista/rivenditore',
        component: AnagraficaListaComponent,
        data: {idTipologia: 113}
      },{
        path: 'lista/commerciale',
        component: AnagraficaListaComponent,
        data: {idTipologia: 13}
      },
      {
        path: 'lista/officina',
        component: AnagraficaListaComponent,
        data: {idTipologia: 14}
      },{
        path: 'lista/operatore',
        component: AnagraficaListaComponent,
        data: {idTipologia: 15}
      },{
        path: 'lista/autista',
        component: AnagraficaListaComponent,
        data: {idTipologia: 16}
      },{
        path: 'lista/installatore',
        component: AnagraficaListaComponent,
        data: {idTipologia: 26}
      },{
        path: 'lista/fornitore',
        component: AnagraficaListaComponent,
        data: {idTipologia: 27}
      },{
        path: 'lista/agente',
        component: AnagraficaListaComponent,
        data: {idTipologia: 37}
      },{
        path: 'lista/relazione',
        component: AnagraficaListaComponent,
        data: {idTipologia: 59}
      },{
        path: 'lista/relazione/:idRela',
        component: AnagraficaListaComponent
      },
      
      {
        path: 'lista',
        component: AnagraficaListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnagraficaRoutingModule { }
