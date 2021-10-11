import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TachoRoutingModule } from './tacho-routing.module';
import { TachoListaComponent } from './tacho-lista/tacho-lista.component';
import { TachoAggiungiComponent } from './tacho-aggiungi/tacho-aggiungi.component';
import { SharedModule } from '../shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbButtonModule, NbCardModule, NbCheckboxModule, NbDatepickerModule, NbIconModule, NbInputModule, NbRadioModule, NbSelectModule, NbSpinnerModule, NbToastrModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrandPipe } from 'src/app/API/PIPES/brand/brand.pipe';
import { ComponentePipe } from 'src/app/API/PIPES/componente/componente.pipe';
import { AnagraficaPipe } from 'src/app/API/PIPES/anagrafica/anagrafica.pipe';


@NgModule({
  declarations: [TachoListaComponent, TachoAggiungiComponent],
  imports: [
    CommonModule,
    TachoRoutingModule,
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
    AnagraficaPipe,
    ComponentePipe,
    BrandPipe
  ]
})
export class TachoModule { }
