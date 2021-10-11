import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbButtonModule, NbInputModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbLayoutModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TestComponent } from './test.component';
import { SharedModule } from '../shared/shared.module';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

@NgModule({
  declarations: [TestComponent],
  imports: [
    CommonModule,
    SharedModule,

    AngularMultiSelectModule,
    NbLayoutModule,

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
  ]
})
export class TestModule { }
