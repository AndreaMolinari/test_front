import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FatturazioneRoutingModule } from './fatturazione-routing.module';
import { FatturazioneComponent } from './fatturazione.component';
import { FatturazioneAggiungiComponent } from './fatturazione-aggiungi/fatturazione-aggiungi.component';
import { FatturazioneListaComponent } from './fatturazione-lista/fatturazione-lista.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbToastrModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FatturazionePipe } from 'src/app/API/PIPES/fatturazione/fatturazione.pipe';


@NgModule({
  declarations: [FatturazioneComponent, FatturazioneAggiungiComponent, FatturazioneListaComponent],
  imports: [
    CommonModule,
    FatturazioneRoutingModule,
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
    FatturazionePipe
  ]
})
export class FatturazioneModule { }
