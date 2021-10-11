import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogAccessiRoutingModule } from './log-accessi-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbInputModule, NbButtonModule, NbTooltipModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbSpinnerModule, NbToastrModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogAccessiListaComponent } from './log-accessi-lista/log-accessi-lista.component';
import { LogAccessiComponent } from './log-accessi.component';
import { LogPipe } from 'src/app/API/PIPES/log.pipe';


@NgModule({
  declarations: [LogAccessiComponent, LogAccessiListaComponent],
  imports: [
    CommonModule,
    LogAccessiRoutingModule,
    SharedModule,

    NbEvaIconsModule,
    Ng2SmartTableModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbButtonModule,
    NbTooltipModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbRadioModule,
    NbSelectModule,
    NbIconModule,
    NbSpinnerModule,
    NbToastrModule.forRoot()
  ],
  providers: [
    LogPipe
  ]
})
export class LogAccessiModule { }
