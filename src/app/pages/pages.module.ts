import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import {
  NbLayoutModule,
  NbSidebarModule,
  NbMenuModule,
  NbIconModule,
  NbActionsModule,
  NbUserModule,
  NbContextMenuModule,
  NbProgressBarModule,
  NbCardModule,
  NbSpinnerModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { DeviceDetectorModule } from 'ngx-device-detector';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TestModule } from './test/test.module';
import { NotFoundModule } from './not-found/not-found.module';
import { SettingsModule } from './settings/settings.module';
import { AnagraficaPipe } from '../API/PIPES/anagrafica/anagrafica.pipe';
import { NgxEchartsModule } from 'ngx-echarts';
import { AnagraficaModule } from './anagrafica/anagrafica.module';
import { ServizioModule } from './servizio/servizio.module';
import { CheckMLSModule } from './check-mls/check-mls.module';


@NgModule({
  declarations: [PagesComponent, DashboardComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    TestModule,
    CheckMLSModule,
    NotFoundModule,
    SettingsModule,

    AnagraficaModule,
    ServizioModule,

    NbCardModule,
    NbActionsModule,
    NbProgressBarModule,
    NbUserModule,
    NbLayoutModule,
    NbSpinnerModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    DeviceDetectorModule.forRoot(),
    NbEvaIconsModule,
    NbIconModule,
    NbContextMenuModule,
    NgxEchartsModule.forRoot({ echarts: () => import('echarts') })
  ],
  providers: [
    AnagraficaPipe
  ],
  exports: [
    NotFoundModule
  ]
})
export class PagesModule { }
