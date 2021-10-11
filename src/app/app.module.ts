import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import { NbThemeModule, NbLayoutModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { AnagraficaPipe } from './API/PIPES/anagrafica/anagrafica.pipe';
import { NbPasswordAuthStrategy, NbAuthModule } from '@nebular/auth';
import { MezzoPipe } from './API/PIPES/mezzo/mezzo.pipe';
import { ServizioPipe } from './API/PIPES/servizio/servizio.pipe';
import { BrandPipe } from './API/PIPES/brand/brand.pipe';
import { NbMomentDateModule } from '@nebular/moment';
import { FatturazionePipe } from './API/PIPES/fatturazione/fatturazione.pipe';
import { ContattoPipe } from './API/PIPES/contatto/contatto.pipe';
import { FatturazioneInserimentoPipe } from './API/PIPES/fatturazione/fatturazione-inserimento.pipe';
import { IndirizzoCreaPipe } from './API/PIPES/indirizzo/indirizzo-crea.pipe';
import { ContattoCreaPipe } from './API/PIPES/contatto/contatto-crea.pipe';
import { UtentePipe } from './API/PIPES/utente/utente.pipe';
import { FlottaPipe } from './API/PIPES/flotta/flotta.pipe';
import { ComponentePipe } from './API/PIPES/componente/componente.pipe';
import { SimPipe } from './API/PIPES/sim/sim.pipe';
import { LogPipe } from './API/PIPES/log.pipe';
import { ModelloPipe } from './API/PIPES/modello/modello.pipe';
import { InserimentiPipe } from './API/PIPES/inserimenti.pipe';
import { TipologiaPipe } from './API/PIPES/tipologia/tipologia.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { environment } from 'src/environments/environment';
import { RadiocomandoPipe } from './API/PIPES/radiocomando/radiocomando.pipe';

registerLocaleData(localeIt, 'it-IT');

@NgModule({
  declarations: [
    AppComponent,
    AnagraficaPipe,
    MezzoPipe,
    ServizioPipe,
    BrandPipe,
    FatturazionePipe,
    ContattoPipe,
    FatturazioneInserimentoPipe,
    IndirizzoCreaPipe,
    ContattoCreaPipe,
    UtentePipe,
    FlottaPipe,
    ComponentePipe,
    SimPipe,
    LogPipe,
    ModelloPipe,
    InserimentiPipe,
    TipologiaPipe,
    RadiocomandoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    HttpClientModule,
    NbThemeModule.forRoot({ name: 'dark' }),
    NbLayoutModule,
    NbEvaIconsModule,
    NbMomentDateModule,
    TableVirtualScrollModule,

    // ?????
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          baseEndpoint: '',
          login: {
            endpoint: environment.apiURL + '/api/login',
            method: 'post',
            redirect: {
              success: '/pages/dashboard',
              failure: null,
            },
            defaultMessages: ['Successo!'],
            defaultErrors: ['Email o Password errate!']
          }
        })
      ],
      forms: {
        login: {
          redirectDelay: 0,
        }
      },
    }),

    ServiceWorkerModule.register('ngsw-worker.js', { enabled: true })
  ],
  // providers: [CookieService, { provide: LOCALE_ID, useValue: 'it-IT' }],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
