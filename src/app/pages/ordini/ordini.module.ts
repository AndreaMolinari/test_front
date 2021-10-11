import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdiniRoutingModule } from './ordini-routing.module';
import { OrdiniComponent } from './ordini.component';
import { OrdiniListaComponent } from './ordini-lista/ordini-lista.component';
import { OrdiniAggiungiComponent } from './ordini-aggiungi/ordini-aggiungi.component';
import { SharedModule } from '../shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbSpinnerModule, NbToastrModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [OrdiniComponent, OrdiniListaComponent, OrdiniAggiungiComponent],
  imports: [
    CommonModule,
    OrdiniRoutingModule,
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
  ]
})
export class OrdiniModule { }
