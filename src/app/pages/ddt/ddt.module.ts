import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DdtRoutingModule } from './ddt-routing.module';
import { DdtComponent } from './ddt.component';
import { DdtAggiungiComponent } from './ddt-aggiungi/ddt-aggiungi.component';
import { DdtListaComponent } from './ddt-lista/ddt-lista.component';
import { SharedModule } from '../shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbSpinnerModule, NbToastrModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [DdtComponent, DdtAggiungiComponent, DdtListaComponent],
  imports: [
    CommonModule,
    DdtRoutingModule,
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
export class DdtModule { }
