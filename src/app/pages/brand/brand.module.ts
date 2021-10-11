import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { BrandRoutingModule } from './brand-routing.module';
import { BrandComponent } from './brand.component';
import { BrandAggiungiComponent } from './brand-aggiungi/brand-aggiungi.component';
import { BrandListaComponent } from './brand-lista/brand-lista.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbToastrModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { BrandPipe } from 'src/app/API/PIPES/brand/brand.pipe';


@NgModule({
  declarations: [BrandComponent, BrandAggiungiComponent, BrandListaComponent],
  imports: [
    CommonModule,
    BrandRoutingModule,
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
export class BrandModule { }
