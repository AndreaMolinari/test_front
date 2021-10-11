import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NbDateService } from '@nebular/theme';
import { AnagraficaService } from 'src/app/API/anagrafica/anagrafica.service';
import { AnagraficaPipe } from 'src/app/API/PIPES/anagrafica/anagrafica.pipe';
import { TipologiaService } from 'src/app/API/tipologia/tipologia.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as env from 'src/environments/env';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'shared-anagrafica-seleziona',
  templateUrl: './anagrafica-seleziona.component.html',
  styleUrls: ['./anagrafica-seleziona.component.less']
})

export class AnagraficaSelezionaComponent implements OnInit, OnDestroy {
  env = environment;
  isRivenditore = env.rivenditore;

  @Output() outForm = new EventEmitter<FormArray>();
  @Input() parentForm: FormArray;
  @Input() max = 1;
  @Input() origine: string = null;
  @Input() titoloComponent = 'Seleziona Anagrafica';
  @Input() modifica: boolean;
  @Input() dataInstance: any;
  @Input() duplicato: boolean;

  todayDate;
  questoForm: FormGroup;
  filteredAnagrafiche: Observable<any[]>;

  arrayAnagrafiche: any[] = [];
  arrayAnagraficheFiltered: Observable<string[]> = new Observable<string[]>();
  arrayRuoli: any[] = [];

  // ? RUNTIME VARIABLES
  UNonEdit: Subscription;

  constructor(
    private fb: FormBuilder,
    private dateService: NbDateService<Date>,
    private apiAnagrafica: AnagraficaService,
    private apiTipologia: TipologiaService,
    private anaPipe: AnagraficaPipe,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.todayDate = dateService.today();
    this.questoForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();
    this.getAnagrafiche();

    if (this.origine === 'installatore') {
      this.filteredAnagrafiche = combineLatest([
        this.apiAnagrafica.filterByTipologia_short(26).pipe(
          map(resp => {
            resp = this.anaPipe.transformAnagraficaShort(resp);
            resp.sort((b, a) => {
              const textA = a.nome.toUpperCase();
              const textB = b.nome.toUpperCase();
              return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
            });
            return resp;
          })
        ),
        this.parentForm.at(0).get('autocomplete').valueChanges.pipe(startWith('')),
        this.parentForm.at(0).get('idAnagrafica').valueChanges.pipe(startWith(this.parentForm.at(0).get('idAnagrafica').value))
      ]).pipe(
        map(([api, search, selectedValue]: [any[], string, number | null]) => {
          let listone = JSON.parse(JSON.stringify(api));
          if (search) {
            listone = api.filter(option => option.nome.trim().toLowerCase().includes(search.trim().toLowerCase()));
          }
          if (selectedValue) {
            const index = listone.findIndex(element => element.id === this.parentForm.at(0).get('idAnagrafica').value);
            if (index !== -1) {
              listone.unshift(listone.splice(index, 1)[0]);
            }
          }
          return listone;
        })
      );
    }


    this.apiAnagrafica.loadAnagraficaRelazioneData.subscribe(datiAnagrafica => {
      this.onEdit(undefined, datiAnagrafica);
    });

    if (this.origine === 'anagrafica') {
      this.getRuoli();
    }
    if (this.modifica === true) {
      this.onEdit(this.dataInstance);
    }
    if (this.duplicato === true) {
      this.onEdit(this.dataInstance);
    }
    let anagraficaRelazione: any;
    anagraficaRelazione = this.activatedRoute.snapshot.paramMap.get('idRela');
    if (anagraficaRelazione != null) {
      this.setAnagraficaPadre(anagraficaRelazione);
    }

    // this.parentForm.at(0).get('idAnagrafica').valueChanges.subscribe({
    //   next: () => {
    //     this.setSelectedValueFirst();
    //   }
    // });
  }

  crea(): FormGroup {
    if (this.origine === 'installatore') {
      if (this.modifica === true) {
        return this.fb.group({
          id: [],
          idServizioInstallatore: [],
          idAnagrafica: [],
          autocomplete: [''],
          dataInstallazione: [null]
        });
      }
      return this.fb.group({
        idAnagrafica: [],
        autocomplete: [''],
        dataInstallazione: [this.todayDate]
      });
    }
    if (this.origine === 'anagrafica') {
      if (this.modifica === true) {
        return this.fb.group({
          id: [],
          idParent: ['', Validators.required],
          idTipologia: ['', Validators.required]
        });
      }
      return this.fb.group({
        idParent: ['', Validators.required],
        idTipologia: ['', Validators.required]
      });
    }
  }

  getAnagrafiche(): void {
    if (this.origine === 'anagrafica') {
      this.apiAnagrafica.filterByTipologia_short(113).subscribe(data => {
        this.arrayAnagrafiche = this.anaPipe.transformAnagraficaShort(data);
      });
    }
    // else if (this.origine === 'installatore') {
    //   this.apiAnagrafica.filterByTipologia_short(26).subscribe(data => {
    //     this.arrayAnagrafiche = this.anaPipe.transformAnagraficaShort(data);
    //     this.customSearch();
    //     // this.setSelectedValueFirst();
    //   });
    // }
  }

  getRuoli(): void {
    this.apiTipologia.filterByID(59).subscribe(data => {
      this.arrayRuoli = data.all_children;
    });
  }

  setAnagraficaPadre(idAnagrafica): void {
    this.parentForm.at(0).get('idAnagrafica').patchValue(idAnagrafica);
  }

  setValidators(): void {
    if (this.origine === 'installatore') {
      this.parentForm.at(0).get('dataInstallazione').setValidators(Validators.required);
      this.parentForm.at(0).get('dataInstallazione').updateValueAndValidity();
    }
  }

  cleanValidators(): void {
    if (this.origine === 'installatore') {
      this.parentForm.at(0).get('dataInstallazione').clearValidators();
      this.parentForm.at(0).get('dataInstallazione').updateValueAndValidity();
    }
  }

  onEdit(data, datiAnagrafica?): void {
    if (this.origine === 'installatore') {
      this.UNonEdit = data.modificaDati.subscribe(resp => {
        this.parentForm.reset();
        setTimeout(() => {
          const dataStripped = {
            data: {
              anno: 1970,
              mese: 0,
              giorno: 1
            }
          };
          if ((resp.installatore !== undefined) && (resp.installatore.length > 0)) {
            if (this.modifica === true) {
              this.parentForm.at(0).get('id').patchValue(resp.installatore[0].id);
              this.parentForm.at(0).get('idServizioInstallatore').patchValue(resp.installatore[0].idServizioInstallatore);
            }
            if (resp.installatore[0].idAnagrafica !== null) {
              this.parentForm.at(0).get('idAnagrafica').patchValue(resp.installatore[0].idAnagrafica);
            }

            if (this.modifica) {
              if (resp.installatore[0].dataInstallazione !== undefined && resp.installatore[0].dataInstallazione !== null) {
                dataStripped.data.anno = (+ this.datePipe.transform(resp.installatore[0].dataInstallazione, 'yyyy'));
                dataStripped.data.mese = (+ this.datePipe.transform(resp.installatore[0].dataInstallazione, 'MM')) - 1;
                dataStripped.data.giorno = (+ this.datePipe.transform(resp.installatore[0].dataInstallazione, 'd'));
                const tempDataInstallazione = this.dateService.createDate(
                  dataStripped.data.anno,
                  dataStripped.data.mese,
                  dataStripped.data.giorno
                );
                this.parentForm.at(0).get('dataInstallazione').patchValue(tempDataInstallazione);
              }

            } else if (this.duplicato) {
              this.parentForm.at(0).get('dataInstallazione').patchValue(this.todayDate);
            }
          } else {
            console.log('Nessun Anagrafica-Installatore collegata!');
          }
        });
      });
    } else if (this.origine === 'anagrafica') {
      if (datiAnagrafica !== undefined && datiAnagrafica !== null) {
        this.parentForm.reset();
        this.parentForm.at(0).get('id').patchValue(datiAnagrafica[0].id);
        this.parentForm.at(0).get('idParent').patchValue(datiAnagrafica[0].idParent);
        this.parentForm.at(0).get('idTipologia').patchValue(datiAnagrafica[0].idTipologia);
      }
    }
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      this.outForm.emit(this.parentForm);
    } else {
      alert('non puoi aggiungere più di ' + this.max + ' anagrafiche');
    }
  }

  remove(i: number): void {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
    if (this.parentForm.length === 0 && this.origine !== 'anagrafica') {
      this.add();
      this.cleanValidators();
    }
  }

  ngOnDestroy(): void {
    if (this.UNonEdit) {
      this.UNonEdit.unsubscribe();
    }
  }

}
