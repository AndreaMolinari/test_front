import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServizioRoutingModule } from './servizio-routing.module';
import { ServizioComponent } from './servizio.component';
import { ServizioAggiungiComponent } from './servizio-aggiungi/servizio-aggiungi.component';
import { ServizioListaComponent } from './servizio-lista/servizio-lista.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbRadioModule,
  NbSelectModule,
  NbIconModule,
  NbToastrModule,
  NbSpinnerModule,
  NbAccordionModule,
  NbStepperModule,
  NbDialogModule
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ServizioPipe } from 'src/app/API/PIPES/servizio/servizio.pipe';
import { InserimentiPipe } from 'src/app/API/PIPES/inserimenti.pipe';


@NgModule({
  declarations: [ServizioComponent, ServizioAggiungiComponent, ServizioListaComponent],
  imports: [
    CommonModule,
    ServizioRoutingModule,
    SharedModule,

    Ng2SmartTableModule,
    NbCardModule,
    NbAccordionModule,
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
    NbStepperModule,
    NbToastrModule.forRoot(),
    NbDialogModule
  ],
  providers: [
    ServizioPipe,
    InserimentiPipe
  ],
  exports: [ServizioListaComponent]
})
export class ServizioModule { }
