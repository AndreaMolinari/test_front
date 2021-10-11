import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponenteRoutingModule } from './componente-routing.module';
import { ComponenteComponent } from './componente.component';
import { ComponenteAggiungiComponent } from './componente-aggiungi/componente-aggiungi.component';
import { ComponenteListaComponent } from './componente-lista/componente-lista.component';
import { SharedModule } from '../shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbToastrModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnagraficaPipe } from 'src/app/API/PIPES/anagrafica/anagrafica.pipe';
import { ComponentePipe } from 'src/app/API/PIPES/componente/componente.pipe';
import { BrandPipe } from 'src/app/API/PIPES/brand/brand.pipe';


@NgModule({
  declarations: [ComponenteComponent, ComponenteAggiungiComponent, ComponenteListaComponent],
  imports: [
    CommonModule,
    ComponenteRoutingModule,
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
export class ComponenteModule { }
