import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventiRoutingModule } from './eventi-routing.module';
import { EventiComponent } from './eventi.component';
import { EventiListaComponent } from './eventi-lista/eventi-lista.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbInputModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbToastrModule, NbCardModule, NbSpinnerModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';


@NgModule({
  declarations: [EventiComponent, EventiListaComponent],
  imports: [
    CommonModule,
    EventiRoutingModule,
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
export class EventiModule { }
