import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnagraficaRoutingModule } from './anagrafica-routing.module';
import { AnagraficaComponent } from './anagrafica.component';
import { AnagraficaAggiungiComponent } from './anagrafica-aggiungi/anagrafica-aggiungi.component';
import { AnagraficaListaComponent } from './anagrafica-lista/anagrafica-lista.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbButtonModule, NbInputModule, NbCheckboxModule, NbDatepickerModule, NbRadioModule, NbSelectModule, NbIconModule, NbToastrModule, NbTooltipModule, NbSpinnerModule, NbAccordionModule, NbContextMenuModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { AnagraficaPipe } from 'src/app/API/PIPES/anagrafica/anagrafica.pipe';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { UtentePipe } from 'src/app/API/PIPES/utente/utente.pipe';
import { InserimentiPipe } from 'src/app/API/PIPES/inserimenti.pipe';

@NgModule({
  declarations: [AnagraficaComponent, AnagraficaAggiungiComponent, AnagraficaListaComponent],
  imports: [
    CommonModule,
    AnagraficaRoutingModule,
    SharedModule,

    NbEvaIconsModule,
    Ng2SmartTableModule,
    NbCardModule,
    NbAccordionModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbButtonModule,
    NbTooltipModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbRadioModule,
    NbSelectModule,
    NbIconModule,
    NbSpinnerModule,
    NbContextMenuModule,
    NbToastrModule.forRoot()
  ],
  providers: [
    AnagraficaPipe,
    UtentePipe,
    InserimentiPipe
  ],
  exports: [ AnagraficaListaComponent ]
})
export class AnagraficaModule { }
