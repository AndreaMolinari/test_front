import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtenteRoutingModule } from './utente-routing.module';

import { NbCardModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbToastrModule, NbSpinnerModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { UtenteComponent } from './utente.component';
import { UtenteListaComponent } from './utente-lista/utente-lista.component';
import { UtenteAggiungiComponent } from './utente-aggiungi/utente-aggiungi.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { UtentePipe } from 'src/app/API/PIPES/utente/utente.pipe';


@NgModule({
  declarations: [UtenteComponent, UtenteListaComponent, UtenteAggiungiComponent],
  imports: [
    CommonModule,
    UtenteRoutingModule,
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
    UtentePipe
  ]
})
export class UtenteModule { }
