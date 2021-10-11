import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MezzoRoutingModule } from './mezzo-routing.module';
import { MezzoComponent } from './mezzo.component';
import { MezzoAggiungiComponent } from './mezzo-aggiungi/mezzo-aggiungi.component';
import { MezzoListaComponent } from './mezzo-lista/mezzo-lista.component';
import { SharedModule } from '../shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbToastrModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MezzoPipe } from 'src/app/API/PIPES/mezzo/mezzo.pipe';
import { ModelloPipe } from 'src/app/API/PIPES/modello/modello.pipe';
import { BrandPipe } from 'src/app/API/PIPES/brand/brand.pipe';


@NgModule({
  declarations: [MezzoComponent, MezzoAggiungiComponent, MezzoListaComponent],
  imports: [
    CommonModule,
    MezzoRoutingModule,
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
    MezzoPipe,
    ModelloPipe,
    BrandPipe
  ]
})
export class MezzoModule { }
