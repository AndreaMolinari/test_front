import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContattoRoutingModule } from './contatto-routing.module';
import { ContattoComponent } from './contatto.component';
import { ContattoAggiungiComponent } from './contatto-aggiungi/contatto-aggiungi.component';
import { ContattoListaComponent } from './contatto-lista/contatto-lista.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbInputModule, NbButtonModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbToastrModule, NbSpinnerModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ContattoPipe } from 'src/app/API/PIPES/contatto/contatto.pipe';


@NgModule({
  declarations: [ContattoComponent, ContattoAggiungiComponent, ContattoListaComponent],
  imports: [
    CommonModule,
    ContattoRoutingModule,
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
    ContattoPipe
  ]
})
export class ContattoModule { }
