import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GruppoFlottaRoutingModule } from './gruppo-flotta-routing.module';
import { GruppoFlottaAggiungiComponent } from './gruppo-flotta-aggiungi/gruppo-flotta-aggiungi.component';
import { GruppoFlottaListaComponent } from './gruppo-flotta-lista/gruppo-flotta-lista.component';
import { SharedModule } from '../shared/shared.module';
import { NbCardModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbSpinnerModule, NbToastrModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GruppoFlottaComponent } from './gruppo-flotta.component';


@NgModule({
  declarations: [GruppoFlottaComponent, GruppoFlottaAggiungiComponent, GruppoFlottaListaComponent],
  imports: [
    CommonModule,
    GruppoFlottaRoutingModule,
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
export class GruppoFlottaModule { }
