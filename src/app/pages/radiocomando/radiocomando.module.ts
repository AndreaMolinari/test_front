import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RadiocomandoRoutingModule } from './radiocomando-routing.module';
import { RadiocomandoComponent } from './radiocomando.component';
import { SharedModule } from '../shared/shared.module';
import { NbCardModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbSpinnerModule, NbToastrModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadiocomandoAggiungiComponent } from './radiocomando-aggiungi/radiocomando-aggiungi.component';
import { RadiocomandoListaComponent } from './radiocomando-lista/radiocomando-lista.component';
import { BrandPipe } from 'src/app/API/PIPES/brand/brand.pipe';


@NgModule({
  declarations: [RadiocomandoComponent, RadiocomandoAggiungiComponent, RadiocomandoListaComponent],
  imports: [
    CommonModule,
    RadiocomandoRoutingModule,
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
    BrandPipe
  ]
})
export class RadiocomandoModule { }
