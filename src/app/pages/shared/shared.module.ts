import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtenteCreaComponent } from './utente/utente-crea/utente-crea.component';
import {
  NbCardModule,
  NbInputModule,
  NbButtonModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbRadioModule,
  NbSelectModule,
  NbIconModule,
  NbDialogModule,
  NbDialogService,
  NbToastrModule,
  NbTooltipModule,
  NbSpinnerModule,
  NbAccordionModule,
  NbAlertModule
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnagraficaCreaComponent } from './anagrafica/anagrafica-crea/anagrafica-crea.component';
import { ContattoCreaComponent } from './contatto/contatto-crea/contatto-crea.component';
import { FatturazioneCreaComponent } from './fatturazione/fatturazione-crea/fatturazione-crea.component';
import { NoteCreaComponent } from './note/note-crea/note-crea.component';
import { ServizioCreaComponent } from './servizio/servizio-crea/servizio-crea.component';
import { BrandCreaComponent } from './brand/brand-crea/brand-crea.component';
import { IndirizzoCreaComponent } from './indirizzo/indirizzo-crea/indirizzo-crea.component';
import { ModelloCreaComponent } from './modello/modello-crea/modello-crea.component';
import { ModelloSelezionaComponent } from './modello/modello-seleziona/modello-seleziona.component';
import { ComponenteCreaComponent } from './componente/componente-crea/componente-crea.component';
import { MezzoCreaComponent } from './mezzo/mezzo-crea/mezzo-crea.component';
import { TipologiaCreaComponent } from './tipologia/tipologia-crea/tipologia-crea.component';
import { ComponenteSelezionaComponent } from './componente/componente-seleziona/componente-seleziona.component';
import { AnagraficaSelezionaComponent } from './anagrafica/anagrafica-seleziona/anagrafica-seleziona.component';
import { MezzoSelezionaComponent } from './mezzo/mezzo-seleziona/mezzo-seleziona.component';
import { ModelloModalComponent } from './modals/modello-modal/modello-modal.component';
import { AnagraficaPipe } from 'src/app/API/PIPES/anagrafica/anagrafica.pipe';
import { NbMomentDateModule } from '@nebular/moment';
import { FlottaCreaComponent } from './flotta/flotta-crea/flotta-crea.component';
import { EventiCreaComponent } from './eventi/eventi-crea/eventi-crea.component';
import { FatturazioneInserimentoPipe } from 'src/app/API/PIPES/fatturazione/fatturazione-inserimento.pipe';
import { IndirizzoCreaPipe } from 'src/app/API/PIPES/indirizzo/indirizzo-crea.pipe';
import { ContattoCreaPipe } from 'src/app/API/PIPES/contatto/contatto-crea.pipe';
import { AnagraficaRelazioneSelezionaComponent } from './anagrafica/Anagrafica Relazione/anagrafica-relazione-seleziona/anagrafica-relazione-seleziona.component';
import { BrandModalComponent } from './modals/brand-modal/brand-modal.component';
import { MezzoModalComponent } from './modals/mezzo-modal/mezzo-modal.component';
import { ComponenteModalComponent } from './modals/componente-modal/componente-modal.component';
import { MezzoPipe } from 'src/app/API/PIPES/mezzo/mezzo.pipe';
import { UtentePipe } from 'src/app/API/PIPES/utente/utente.pipe';
import { RadiocomandoCreaComponent } from './radiocomando/radiocomando-crea/radiocomando-crea.component';
import { RadiocomandoSelezionaComponent } from './radiocomando/radiocomando-seleziona/radiocomando-seleziona.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FlottaPipe } from 'src/app/API/PIPES/flotta/flotta.pipe';
import { ListaServiziButtonComponent } from './ng-smart-table-customs/lista-servizi-button/lista-servizi-button.component';
import { SimCreaComponent } from './sim/sim-crea/sim-crea.component';
import { SimPipe } from 'src/app/API/PIPES/sim/sim.pipe';
import { ServizioPipe } from 'src/app/API/PIPES/servizio/servizio.pipe';
import { ListaMezziButtonComponent } from './ng-smart-table-customs/lista-mezzi-button/lista-mezzi-button.component';
import { ServizioModalComponent } from './modals/servizio-modal/servizio-modal.component';
import { UtenteModalComponent } from './modals/utente-modal/utente-modal.component';
import { ListaComponenteButtonComponent } from './ng-smart-table-customs/lista-componente-button/lista-componente-button.component';
import { ComponentePipe } from 'src/app/API/PIPES/componente/componente.pipe';
import { ListaTachigrafoButtonComponent } from './ng-smart-table-customs/lista-tachigrafo-button/lista-tachigrafo-button.component';
import { ListaAnagraficaButtonComponent } from './ng-smart-table-customs/lista-anagrafica-button/lista-anagrafica-button.component';
import { ListaCheckboxFlottaComponent } from './ng-smart-table-customs/lista-checkbox-flotta/lista-checkbox-flotta.component';
import { OrdiniCreaComponent } from './ordini/ordini-crea/ordini-crea.component';
import { DdtCreaComponent } from './ddt/ddt-crea/ddt-crea.component';
import { SimModalComponent } from './modals/sim-modal/sim-modal.component';
import { ServizioAggiungiModalComponent } from './modals/servizio-aggiungi-modal/servizio-aggiungi-modal.component';
import { DocumentoCreaComponent } from './anagrafica/documento-crea/documento-crea.component';
import { TipologiaPipe } from 'src/app/API/PIPES/tipologia/tipologia.pipe';
import { ListaApplicativiButtonComponent } from './ng-smart-table-customs/lista-applicativi-button/lista-applicativi-button.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ServizioInFlottaModalComponent } from './modals/servizio-in-flotta-modal/servizio-in-flotta-modal.component';
import { TachoCreaComponent } from './tacho/tacho-crea/tacho-crea.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { NewServizioModalComponent } from './modals/new-servizio-modal/new-servizio-modal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { ElencoErroriComponent } from './modals/elenco-errori/elenco-errori.component';
import { RadiocomandoPipe } from 'src/app/API/PIPES/radiocomando/radiocomando.pipe';
import { RadiocomandoModalComponent } from './modals/radiocomando-modal/radiocomando-modal.component';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    UtenteCreaComponent,
    AnagraficaCreaComponent,
    AnagraficaSelezionaComponent,
    ContattoCreaComponent,
    FatturazioneCreaComponent,
    NoteCreaComponent,
    ServizioCreaComponent,
    BrandCreaComponent,
    IndirizzoCreaComponent,
    ModelloCreaComponent,
    ModelloSelezionaComponent,
    ComponenteCreaComponent,
    ComponenteSelezionaComponent,
    MezzoCreaComponent,
    MezzoSelezionaComponent,
    TipologiaCreaComponent,
    ModelloModalComponent,
    BrandModalComponent,
    MezzoModalComponent,
    ComponenteModalComponent,
    FlottaCreaComponent,
    EventiCreaComponent,
    AnagraficaRelazioneSelezionaComponent,
    RadiocomandoCreaComponent,
    RadiocomandoSelezionaComponent,
    ListaServiziButtonComponent,
    SimCreaComponent,
    ListaMezziButtonComponent,
    ServizioModalComponent,
    UtenteModalComponent,
    SimModalComponent,
    ListaComponenteButtonComponent,
    ListaTachigrafoButtonComponent,
    ListaAnagraficaButtonComponent,
    ListaCheckboxFlottaComponent,
    OrdiniCreaComponent,
    DdtCreaComponent,
    ServizioAggiungiModalComponent,
    DocumentoCreaComponent,
    ListaApplicativiButtonComponent,
    ServizioInFlottaModalComponent,
    TachoCreaComponent,
    NewServizioModalComponent,
    ElencoErroriComponent,
    RadiocomandoModalComponent
  ],
  imports: [
    CommonModule,

    NbCardModule,
    NbAccordionModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbDatepickerModule.forRoot(),
    NbRadioModule,
    NbSelectModule,
    NbTooltipModule,
    NbSpinnerModule,
    NbAlertModule,
    NbIconModule,
    NbMomentDateModule,
    NbDialogModule.forRoot(),
    NbToastrModule.forRoot(),
    NbAlertModule,
    Ng2SmartTableModule,

    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatIconModule,
    ScrollingModule,
    MatTableModule,
    MatCheckboxModule,
    TableVirtualScrollModule,
    MatButtonModule
  ],
  exports: [
    UtenteCreaComponent,
    AnagraficaCreaComponent,
    AnagraficaSelezionaComponent,
    ContattoCreaComponent,
    FatturazioneCreaComponent,
    NoteCreaComponent,
    ServizioCreaComponent,
    BrandCreaComponent,
    IndirizzoCreaComponent,
    ModelloCreaComponent,
    ModelloSelezionaComponent,
    ComponenteCreaComponent,
    TachoCreaComponent,
    ComponenteSelezionaComponent,
    MezzoCreaComponent,
    MezzoSelezionaComponent,
    TipologiaCreaComponent,
    ModelloModalComponent,
    BrandModalComponent,
    MezzoModalComponent,
    ComponenteModalComponent,
    FlottaCreaComponent,
    EventiCreaComponent,
    AnagraficaRelazioneSelezionaComponent,
    RadiocomandoCreaComponent,
    RadiocomandoSelezionaComponent,
    ListaServiziButtonComponent,
    ListaApplicativiButtonComponent,
    ListaMezziButtonComponent,
    SimCreaComponent,
    ServizioModalComponent,
    ServizioAggiungiModalComponent,
    UtenteModalComponent,
    SimModalComponent,
    ListaComponenteButtonComponent,
    ListaTachigrafoButtonComponent,
    ListaAnagraficaButtonComponent,
    ListaCheckboxFlottaComponent,
    OrdiniCreaComponent,
    DdtCreaComponent,
    DocumentoCreaComponent,
    ServizioInFlottaModalComponent,
    NewServizioModalComponent,
    ElencoErroriComponent,
    RadiocomandoModalComponent
  ],
  entryComponents: [
    UtenteCreaComponent,
    AnagraficaCreaComponent,
    AnagraficaSelezionaComponent,
    ContattoCreaComponent,
    FatturazioneCreaComponent,
    NoteCreaComponent,
    ServizioCreaComponent,
    BrandCreaComponent,
    IndirizzoCreaComponent,
    ModelloCreaComponent,
    ModelloSelezionaComponent,
    ComponenteCreaComponent,
    TachoCreaComponent,
    ComponenteSelezionaComponent,
    MezzoCreaComponent,
    MezzoSelezionaComponent,
    TipologiaCreaComponent,
    ModelloModalComponent,
    BrandModalComponent,
    MezzoModalComponent,
    ComponenteModalComponent,
    FlottaCreaComponent,
    EventiCreaComponent,
    AnagraficaRelazioneSelezionaComponent,
    RadiocomandoCreaComponent,
    RadiocomandoSelezionaComponent,
    ListaServiziButtonComponent,
    ListaApplicativiButtonComponent,
    ListaMezziButtonComponent,
    SimCreaComponent,
    ServizioModalComponent,
    ServizioAggiungiModalComponent,
    UtenteModalComponent,
    SimModalComponent,
    ListaComponenteButtonComponent,
    ListaTachigrafoButtonComponent,
    ListaAnagraficaButtonComponent,
    ListaCheckboxFlottaComponent,
    OrdiniCreaComponent,
    DdtCreaComponent,
    DocumentoCreaComponent,
    ServizioInFlottaModalComponent,
    NewServizioModalComponent,
    ElencoErroriComponent,
    RadiocomandoModalComponent
  ],
  providers: [
    NbDialogService,
    AnagraficaPipe,
    FatturazioneInserimentoPipe,
    IndirizzoCreaPipe,
    ContattoCreaPipe,
    ComponentePipe,
    MezzoPipe,
    UtentePipe,
    ServizioPipe,
    FlottaPipe,
    SimPipe,
    TipologiaPipe,
    ListaMezziButtonComponent,
    ListaTachigrafoButtonComponent,
    RadiocomandoPipe
  ]
})
export class SharedModule { }
