import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TipologiaService } from 'src/app/API/tipologia/tipologia.service';
import { AnagraficaService } from 'src/app/API/anagrafica/anagrafica.service';
import { NbToastrService, NbDateService } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as env from 'src/environments/env';
import { AnagraficaPipe } from 'src/app/API/PIPES/anagrafica/anagrafica.pipe';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'shared-anagrafica-crea',
  templateUrl: './anagrafica-crea.component.html',
  styleUrls: ['./anagrafica-crea.component.less']
})

export class AnagraficaCreaComponent implements OnInit, OnDestroy {
  env = environment;
  isRivenditore = env.rivenditore;

  @Output() outForm = new EventEmitter<FormArray>();
  @Input() parentForm: FormArray;
  @Input() max = 1;
  @Input() modifica: boolean;
  @Input() origin = 'crud';
  @Input() dataInstance: any;

  cardAccent = 'primary';

  questoForm: FormGroup;

  tipologieAnagrafica = [];

  generiAnagrafica = [];

  anagraficheCommerciale = [];
  anagraficheLegale = [];

  UNtipologiaAnagrafica: Subscription;
  UNgenereAnagrafica: Subscription;
  UNonEdit: Subscription;

  readonlyForm = false;

  constructor(
    private fb: FormBuilder,
    private apiTipologia: TipologiaService,
    private apiAnagrafica: AnagraficaService,
    private anagraficaPipe: AnagraficaPipe,
    private toastrService: NbToastrService,
    private activateRoute: ActivatedRoute,
    public datePipe: DatePipe,
    protected dateService: NbDateService<Date>
  ) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit() {
    if (this.origin === 'crud') { this.cardAccent = 'success'; } else { this.cardAccent = ''; }
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();
    this.tipologiaAnagrafica();

    this.parentForm.at(0).get('dataNascita').markAsDirty();

    let tipologiaID: any;
    tipologiaID = this.activateRoute.snapshot.paramMap.get('idTipo');
    if (tipologiaID != null) {
      this.parentForm.at(0).get('idTipologia').patchValue([tipologiaID]);
    }
    if (this.modifica === true) {
      this.onEdit(this.dataInstance);
    }
  }

  onChange(fg: any, $event: string) {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;

    const specificForm = this.parentForm.at(fg);

    if (($event == '21') || ($event == '22')) {
      specificForm.get('ragSoc').setValidators(Validators.required);
      specificForm.get('ragSoc').updateValueAndValidity();

      specificForm.get('pIva').setValidators(Validators.required);
      specificForm.get('pIva').updateValueAndValidity();

      specificForm.get('nome').clearValidators();
      specificForm.get('nome').updateValueAndValidity();

      specificForm.get('cognome').clearValidators();
      specificForm.get('cognome').updateValueAndValidity();

      specificForm.get('codFisc').clearValidators();
      specificForm.get('codFisc').updateValueAndValidity();
    } else if ($event == '20') {
      specificForm.get('nome').setValidators(Validators.required);
      specificForm.get('nome').updateValueAndValidity();

      specificForm.get('cognome').setValidators(Validators.required);
      specificForm.get('cognome').updateValueAndValidity();

      specificForm.get('codFisc').setValidators(Validators.required);
      specificForm.get('codFisc').updateValueAndValidity();

      specificForm.get('ragSoc').clearValidators();
      specificForm.get('ragSoc').updateValueAndValidity();

      specificForm.get('pIva').clearValidators();
      specificForm.get('pIva').updateValueAndValidity();
    } else if ($event == '102') {
      specificForm.get('ragSoc').setValidators(Validators.required);
      specificForm.get('ragSoc').updateValueAndValidity();

      specificForm.get('pIva').clearValidators();
      specificForm.get('pIva').updateValueAndValidity();

      specificForm.get('nome').clearValidators();
      specificForm.get('nome').updateValueAndValidity();

      specificForm.get('cognome').clearValidators();
      specificForm.get('cognome').updateValueAndValidity();

      specificForm.get('codFisc').clearValidators();
      specificForm.get('codFisc').updateValueAndValidity();
    }
  }

  crea(): FormGroup {
    if (this.modifica === true) {
      return this.fb.group({
        id: [],
        idTipologia: [[], Validators.required],
        idGenere: [null, Validators.required],
        idCommerciale: [null],
        referenteLegale: [null],
        nome: [null],
        ragSoc: [null],
        pIva: [null],
        cognome: [null],
        codFisc: [null],
        dataNascita: [null],
      });
    } else {
      return this.fb.group({
        idTipologia: [[], Validators.required],
        idGenere: [null, Validators.required],
        idCommerciale: [null],
        referenteLegale: [null],
        nome: [null],
        ragSoc: [null],
        pIva: [null],
        cognome: [null],
        codFisc: [null],
        dataNascita: [null],
      });
    }
  }

  tipologiaAnagrafica() {
    this.UNtipologiaAnagrafica = this.apiTipologia.filterByID(18).subscribe(data => {
      this.tipologieAnagrafica = data.all_children;
      if (env.rivenditore && !this.modifica) { this.parentForm.at(0).get('idTipologia').setValue(['12']); }
    });
    this.UNgenereAnagrafica = this.apiTipologia.filterByID(19).subscribe(data => {
      this.generiAnagrafica = data.all_children;
    });

    this.apiAnagrafica.filterByTipologia_short(13).subscribe(data => {
      this.anagraficheCommerciale = this.anagraficaPipe.transformAnagraficaShort(data);
    });
  }

  autocompleteOnPIVA(PIVA, indice) {
    this.apiAnagrafica.getPIVA({ pIva: PIVA }).subscribe(data => {
      if (data.length < 1) {
        this.toastrService.info('Inserire manualmente la ragione sociale', 'P.IVA ' + PIVA + ' NON trovata o NON valida!');
      } else {
        this.parentForm.at(indice).get('ragSoc').patchValue(data.ragSoc);
      }
    }, error => {
      this.toastrService.info('Inserire manualmente la ragione sociale', 'P.IVA NON trovata o NON valida!',
        { limit: 1, preventDuplicates: true });
      console.error(error);
    });
  }

  cleanField(indice) {
    this.parentForm.at(indice).get('ragSoc').reset();
  }

  onEdit(data) {
    if (this.origin === 'crud') {
      this.cardAccent = 'warning';
    } else {
      this.cardAccent = '';
    }
    this.UNonEdit = data.modificaDati.subscribe(data => {
      console.log('MODIFICA/anagrafica', data);
      const tempTipologia = [];
      data.tipologia.forEach(element => {
        tempTipologia.push(element.idTipologia.toString())
      });
      if (data !== undefined) {
        setTimeout(() => {
          this.parentForm.at(0).get('id').patchValue(data.id);
          this.parentForm.at(0).get('idTipologia').patchValue(tempTipologia);
          this.parentForm.at(0).get('idGenere').patchValue(data.idGenere.toString());
          if (data.idCommerciale !== null) {
            this.parentForm.at(0).get('idCommerciale').patchValue(data.idCommerciale.toString());
          }
          this.parentForm.at(0).get('referenteLegale').patchValue(data.referenteLegale);
          this.parentForm.at(0).get('codFisc').patchValue(data.codFisc);
          if (data.idGenere == 21 || data.idGenere == 22) {
            this.parentForm.at(0).get('ragSoc').patchValue(data.ragSoc);
            this.parentForm.at(0).get('pIva').patchValue(data.pIva);
          } else if (data.idGenere == 20) {
            this.parentForm.at(0).get('nome').patchValue(data.nome);
            this.parentForm.at(0).get('cognome').patchValue(data.cognome);
            if (data.dataNascita !== null) {
              let dataStripped = {
                anno: 1970,
                mese: 0,
                giorno: 1
              };
              dataStripped.anno = parseInt(this.datePipe.transform(data.dataNascita, 'yyyy'));
              dataStripped.mese = parseInt(this.datePipe.transform(data.dataNascita, 'MM')) - 1;
              dataStripped.giorno = parseInt(this.datePipe.transform(data.dataNascita, 'd'));
              let temp_dataNascita = this.dateService.createDate(dataStripped.anno, dataStripped.mese, dataStripped.giorno);
              this.parentForm.at(0).get('dataNascita').dirty;
              this.parentForm.at(0).get('dataNascita').patchValue(temp_dataNascita);
            }
          }
        })
      } else {
        console.log('Nessun anagrafica collegata!');
      }
    })
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      this.outForm.emit(this.parentForm);
    } else {
      alert('Non puoi aggiungere più di ' + this.max + ' anagrafiche');
    }
  }

  remove(i) {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
  }

  ngOnDestroy() {
    if (this.UNonEdit) {
      this.UNonEdit.unsubscribe();
    }
  }

}
