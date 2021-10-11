import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SimRoutingModule } from './sim-routing.module';
import { SimComponent } from './sim.component';
import { SharedModule } from '../shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbRadioModule, NbDatepickerModule, NbSelectModule, NbIconModule, NbToastrModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimAggiungiComponent } from './sim-aggiungi/sim-aggiungi.component';
import { SimListaComponent } from './sim-lista/sim-lista.component';
import { SimPipe } from 'src/app/API/PIPES/sim/sim.pipe';
import { BrandPipe } from 'src/app/API/PIPES/brand/brand.pipe';
import { ComponentePipe } from 'src/app/API/PIPES/componente/componente.pipe';
import { SimMassivaComponent } from './sim-massiva/sim-massiva.component';


@NgModule({
  declarations: [SimComponent, SimAggiungiComponent, SimListaComponent, SimMassivaComponent],
  imports: [
    CommonModule,
    SimRoutingModule,
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
    SimPipe,
    BrandPipe,
    ComponentePipe
  ]
})
export class SimModule { }