import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipologiaRoutingModule } from './tipologia-routing.module';
import { TipologiaComponent } from './tipologia.component';
import { TipologiaAggiungiComponent } from './tipologia-aggiungi/tipologia-aggiungi.component';
import { TipologiaListaComponent } from './tipologia-lista/tipologia-lista.component';
import { SharedModule } from '../shared/shared.module';
import { NbCardModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbTreeGridModule, NbToastrModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [TipologiaComponent, TipologiaAggiungiComponent, TipologiaListaComponent],
  imports: [
    CommonModule,
    TipologiaRoutingModule,
    SharedModule,

    NbTreeGridModule,
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
  ]
})
export class TipologiaModule { }
