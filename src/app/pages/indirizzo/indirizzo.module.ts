import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndirizzoRoutingModule } from './indirizzo-routing.module';
import { IndirizzoComponent } from './indirizzo.component';
import { IndirizzoAggiungiComponent } from './indirizzo-aggiungi/indirizzo-aggiungi.component';
import { IndirizzoListaComponent } from './indirizzo-lista/indirizzo-lista.component';
import { SharedModule } from '../shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbToastrModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnagraficaPipe } from 'src/app/API/PIPES/anagrafica/anagrafica.pipe';
import { IndirizzoCreaPipe } from 'src/app/API/PIPES/indirizzo/indirizzo-crea.pipe';


@NgModule({
  declarations: [IndirizzoComponent, IndirizzoAggiungiComponent, IndirizzoListaComponent],
  imports: [
    CommonModule,
    IndirizzoRoutingModule,
    SharedModule,

    Ng2SmartTableModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbRadioModule,
    NbSelectModule,
    NbIconModule,
    NbSpinnerModule,
    NbToastrModule.forRoot()
  ],
  providers: [
    AnagraficaPipe,
    IndirizzoCreaPipe
  ]
})
export class IndirizzoModule { }
