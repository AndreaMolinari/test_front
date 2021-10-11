import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbButtonModule, NbCardModule, NbDatepickerModule, NbIconModule, NbInputModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { CheckMLSComponent } from './check-mls.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [CheckMLSComponent],
  imports: [
    CommonModule,
    Ng2SmartTableModule,
    ReactiveFormsModule,
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbSpinnerModule,
    NbDatepickerModule
  ]
})
export class CheckMLSModule { }
