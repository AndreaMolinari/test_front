import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlottaComponent } from './flotta.component';
import { FlottaAggiungiComponent } from './flotta-aggiungi/flotta-aggiungi.component';
import { FlottaListaComponent } from './flotta-lista/flotta-lista.component';
import { FlottaRoutingModule } from './flotta-routing.module';
import { SharedModule } from '../shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbToastrModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [FlottaComponent, FlottaAggiungiComponent, FlottaListaComponent],
  imports: [
    CommonModule,
    FlottaRoutingModule,
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
    NbToastrModule.forRoot(),

    MatIconModule
  ]
})
export class FlottaModule { }
