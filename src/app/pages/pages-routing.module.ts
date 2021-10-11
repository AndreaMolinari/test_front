import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TestComponent } from './test/test.component';
import { SettingsComponent } from './settings/settings.component';
import { CheckMLSComponent } from './check-mls/check-mls.component';


const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }, {
        path: 'dashboard',
        component: DashboardComponent
      }, {
        path: 'utente',
        loadChildren: () => import('./utente/utente.module')
          .then(m => m.UtenteModule)
      }, {
        path: 'tipologia',
        loadChildren: () => import('./tipologia/tipologia.module')
          .then(m => m.TipologiaModule)
      }, {
        path: 'anagrafica',
        loadChildren: () => import('./anagrafica/anagrafica.module')
          .then(m => m.AnagraficaModule)
      }, {
        path: 'indirizzo',
        loadChildren: () => import('./indirizzo/indirizzo.module')
          .then(m => m.IndirizzoModule)
      }, {
        path: 'contatto',
        loadChildren: () => import('./contatto/contatto.module')
          .then(m => m.ContattoModule)
      }, {
        path: 'fatturazione',
        loadChildren: () => import('./fatturazione/fatturazione.module')
          .then(m => m.FatturazioneModule)
      }, {
        path: 'brand',
        loadChildren: () => import('./brand/brand.module')
          .then(m => m.BrandModule)
      }, {
        path: 'modello',
        loadChildren: () => import('./modello/modello.module')
          .then(m => m.ModelloModule)
      }, {
        path: 'mezzo',
        loadChildren: () => import('./mezzo/mezzo.module')
          .then(m => m.MezzoModule)
      }, {
        path: 'gruppoflotta',
        loadChildren: () => import('./gruppo-flotta/gruppo-flotta.module')
          .then(m => m.GruppoFlottaModule)
      }, {
        path: 'flotta',
        loadChildren: () => import('./flotta/flotta.module')
          .then(m => m.FlottaModule)
      }, {
        path: 'componente',
        loadChildren: () => import('./componente/componente.module')
          .then(m => m.ComponenteModule)
      }, {
        path: 'tacho',
        loadChildren: () => import('./tacho/tacho.module')
          .then(m => m.TachoModule)
      }, {
        path: 'ordini',
        loadChildren: () => import('./ordini/ordini.module')
          .then(m => m.OrdiniModule)
      }, {
        path: 'ddt',
        loadChildren: () => import('./ddt/ddt.module')
          .then(m => m.DdtModule)
      }, {
        path: 'sim',
        loadChildren: () => import('./sim/sim.module')
          .then(m => m.SimModule)
      }, {
        path: 'radiocomando',
        loadChildren: () => import('./radiocomando/radiocomando.module')
          .then(m => m.RadiocomandoModule)
      }, {
        path: 'eventi',
        loadChildren: () => import('./eventi/eventi.module')
          .then(m => m.EventiModule)
      }, {
        path: 'servizio',
        loadChildren: () => import('./servizio/servizio.module')
          .then(m => m.ServizioModule)
      }, {
        path: 'note',
        loadChildren: () => import('./note/note.module')
          .then(m => m.NoteModule)
      }, {
        path: 'log',
        loadChildren: () => import('./log-accessi/log-accessi.module')
          .then(m => m.LogAccessiModule)
      }, {
        path: 'check_mls',
        component: CheckMLSComponent
      }, {
        path: 'test',
        component: TestComponent
      }, {
        path: 'settings',
        component: SettingsComponent
      }, {
        path: '**',
        component: NotFoundComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
