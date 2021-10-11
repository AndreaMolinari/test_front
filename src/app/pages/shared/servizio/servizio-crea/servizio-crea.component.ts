import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NbDateService } from '@nebular/theme';
import { AnagraficaService } from 'src/app/API/anagrafica/anagrafica.service';
import { TipologiaService } from 'src/app/API/tipologia/tipologia.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as env from 'src/environments/env';
import * as globals from 'src/environments/globals';
import { AnagraficaPipe } from 'src/app/API/PIPES/anagrafica/anagrafica.pipe';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'shared-servizio-crea',
  templateUrl: './servizio-crea.component.html',
  styleUrls: ['./servizio-crea.component.less']
})

export class ServizioCreaComponent implements OnInit, OnDestroy {
  env = environment;
  isRivenditore = env.rivenditore;
  globals = globals;

  @Output() outForm = new EventEmitter<FormArray>();
  @Input() parentForm: FormArray;
  @Input() max = 1;
  @Input() modifica: boolean;
  @Input() dataInstance: any;
  @Input() duplicato: boolean;

  todayDate;
  questoForm: FormGroup;

  arrayAnagrafiche = [];
  arrayAnagraficheFiltered: Observable<object[]> = new Observable<object[]>();
  arrayCausali = [];
  arrayCadenze = [];
  arrayWebService = [];

  filteredClients: Observable<any[]> = new Observable<any[]>();

  // ? RUNTIME VARIABLES
  UNonEdit: Subscription;

  constructor(
    private fb: FormBuilder,
    private dateService: NbDateService<Date>,
    private datePipe: DatePipe,
    private apiTipologia: TipologiaService,
    private apiAnagrafica: AnagraficaService,
    private anagraficaPipe: AnagraficaPipe,
    private activatedRoute: ActivatedRoute
  ) {
    this.todayDate = dateService.today();  // ? Prende la data di oggi e la inserisce in dataInizio
    this.questoForm = this.fb.group({});
  }

  ngOnInit(): void {
    const urlIDanagrafica = this.activatedRoute.snapshot.paramMap.get('idAnagrafica');
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();
    this.getCausali();
    this.getCadenze();
    this.getWebSevices();

    this.parentForm.at(0).get('dataInizio').markAsDirty();
    this.parentForm.at(0).get('dataFine').markAsDirty();

    if (this.modifica === true) {
      this.onEdit(this.dataInstance);
    } else if (this.duplicato === true) {
      this.onEdit(this.dataInstance);
    }
    if (urlIDanagrafica) {
      this.autocompleteAnagrafica(urlIDanagrafica);
    }

    this.filteredClients = combineLatest([
      this.apiAnagrafica.filterByTipologia_short(12).pipe(
        map(resp => {
          resp = this.anagraficaPipe.transformAnagraficaShort(resp);
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
      map(([apiResult, search, selectedValue]: [any[], string, number]) => {
        let results = apiResult;
        if (search) {
          results = apiResult.filter(option => option.nome.trim().toLowerCase().includes(search.trim().toLowerCase()));
        }
        if (selectedValue) {
          const index = results.findIndex(element => element.id === this.parentForm.at(0).get('idAnagrafica').value);
          if (index !== -1) {
            results.unshift(results.splice(index, 1)[0]);
          }
        }
        return results;
      })
    );
  }

  crea(): FormGroup {
    if (this.modifica === true) {
      return this.fb.group({
        id: [],
        idAnagrafica: [Validators.required],
        autocomplete: [''],
        idCausale: ['', Validators.required],
        prezzo: [''],
        idPeriodo: ['', Validators.required],
        applicativo: [[], Validators.required],
        dataInizio: [null, Validators.required],
        dataFine: [null],
        dataSospInizio: [null],
        dataSospFine: [null]
      });
    }
    return this.fb.group({
      idAnagrafica: ['', Validators.required],
      autocomplete: [''],
      idCausale: ['', Validators.required],
      prezzo: [''],
      idPeriodo: ['', Validators.required],
      applicativo: [[], Validators.required],
      dataInizio: [this.todayDate, Validators.required],
      dataFine: [],
      dataSospInizio: [null],
      dataSospFine: [null]
    });
  }

  private _filterAnagrafiche(value: string): object[] {
    const filterValue = value.trim().toLowerCase();
    return this.arrayAnagrafiche.filter(option => option.nome.toLowerCase().includes(filterValue));
  }

  // getAnagrafiche(): void {
  //   this.apiAnagrafica.filterByTipologia_short(12).subscribe(data => {
  //     this.arrayAnagrafiche = this.anagraficaPipe.transformAnagraficaShort(data);
  //     this.customSearch(0);
  //   });
  // }

  customSearch(i?: number): void {
    if (typeof (i) === 'number') {
      this.arrayAnagraficheFiltered = new Observable<object[]>(observer => {
        observer.next(this._filterAnagrafiche(this.parentForm.at(i).get('autocomplete').value));
      });
    }
  }

  getCausali(): void {
    this.apiTipologia.filterByID(91).subscribe(data => {
      this.arrayCausali = data;
    });
  }

  getWebSevices(): void {
    this.apiTipologia.filterByID(83).subscribe(data => {
      this.arrayWebService = data;
    });
  }

  getCadenze(): void {
    this.apiTipologia.filterByID(50).subscribe(data => {
      this.arrayCadenze = data;
    });
  }

  autocompleteAnagrafica(data): void {
    this.parentForm.at(0).get('idAnagrafica').patchValue(+data);
  }

  onEdit(data): void {
    this.UNonEdit = data.modificaDati.subscribe(data => {
      const idApplicativoTEMP = [];
      data.applicativo.forEach(element => {
        idApplicativoTEMP.push(element.idApplicativo.toString());
      });
      if (data !== undefined) {
        if (this.modifica === true) { this.parentForm.at(0).get('id').patchValue(data.id); }
        this.parentForm.at(0).get('idAnagrafica').patchValue(data.idAnagrafica);
        this.parentForm.at(0).get('idCausale').patchValue(data.idCausale.toString());
        this.parentForm.at(0).get('prezzo').patchValue(data.prezzo);
        this.parentForm.at(0).get('idPeriodo').patchValue(data.idPeriodo.toString());
        this.parentForm.at(0).get('applicativo').patchValue(idApplicativoTEMP);

        const dataStripped = {
          inizio: {
            anno: parseInt(this.datePipe.transform(data.dataInizio, 'yyyy')),
            mese: parseInt(this.datePipe.transform(data.dataInizio, 'MM')) - 1,
            giorno: parseInt(this.datePipe.transform(data.dataInizio, 'd'))
          },
          fine: {
            anno: parseInt(this.datePipe.transform(data.dataFine, 'yyyy')),
            mese: parseInt(this.datePipe.transform(data.dataFine, 'MM')) - 1,
            giorno: parseInt(this.datePipe.transform(data.dataFine, 'd'))
          },
          inizioSosp: {
            anno: parseInt(this.datePipe.transform(data.dataSospInizio, 'yyyy')),
            mese: parseInt(this.datePipe.transform(data.dataSospInizio, 'MM')) - 1,
            giorno: parseInt(this.datePipe.transform(data.dataSospInizio, 'd'))
          },
          fineSosp: {
            anno: parseInt(this.datePipe.transform(data.dataSospFine, 'yyyy')),
            mese: parseInt(this.datePipe.transform(data.dataSospFine, 'MM')) - 1,
            giorno: parseInt(this.datePipe.transform(data.dataSospFine, 'd'))
          }
        };

        const tempDataFine = this.dateService.createDate(dataStripped.fine.anno, dataStripped.fine.mese, dataStripped.fine.giorno);
        const tempDataInizio = this.dateService.createDate(dataStripped.inizio.anno, dataStripped.inizio.mese, dataStripped.inizio.giorno);
        const tempDataInizioSosp = this.dateService.createDate(
          dataStripped.inizioSosp.anno,
          dataStripped.inizioSosp.mese,
          dataStripped.inizioSosp.giorno);
        const tempDataFineSosp = this.dateService.createDate(
          dataStripped.fineSosp.anno,
          dataStripped.fineSosp.mese,
          dataStripped.fineSosp.giorno);

        this.parentForm.at(0).get('dataInizio').setValue(tempDataInizio);
        if (data.dataFine !== null) {
          this.parentForm.at(0).get('dataFine').setValue(tempDataFine);
        }
        if (data.dataSospInizio !== null) {
          this.parentForm.at(0).get('dataSospInizio').setValue(tempDataInizioSosp);
        }
        if (data.dataSospFine !== null) {
          this.parentForm.at(0).get('dataSospFine').setValue(tempDataFineSosp);
        }
      }
    });
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      this.outForm.emit(this.parentForm);
    } else {
      alert('non puoi aggiungere più di ' + this.max + ' servizi');
    }
  }

  remove(i) {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
  }

  ngOnDestroy() {
    if (this.UNonEdit) { this.UNonEdit.unsubscribe(); }
  }

}
