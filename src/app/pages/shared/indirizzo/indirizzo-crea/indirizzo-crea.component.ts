import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { TipologiaService } from 'src/app/API/tipologia/tipologia.service';
import { IndirizzoService } from 'src/app/API/indirizzo/indirizzo.service';
import { NbToastrService } from '@nebular/theme';
import { IndirizzoCreaPipe } from 'src/app/API/PIPES/indirizzo/indirizzo-crea.pipe';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shared-indirizzo-crea',
  templateUrl: './indirizzo-crea.component.html',
  styleUrls: ['./indirizzo-crea.component.less']
})
export class IndirizzoCreaComponent implements OnInit, OnDestroy {
  env = environment;

  @Output() outForm = new EventEmitter<FormArray>();
  @Input() parentForm: FormArray;
  @Input() max = 99;
  @Input() modifica: boolean;
  @Input() origin = 'crud';
  @Input() dataInstance: any;

  cardAccent = 'basic';

  questoForm: FormGroup;

  tipologieIndirizzo: any[] = [];
  multiCAP: any[] = [];

  UNonEdit: Subscription;

  constructor(
    private fb: FormBuilder,
    private apiTipologia: TipologiaService,
    private apiIndirizzo: IndirizzoService,
    private indirizzoCreaPipe: IndirizzoCreaPipe,
    private toastrService: NbToastrService) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.cardAccent = (this.origin === 'crud') ? 'success' : 'basic';
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();
    this.tipologiaIndirizzo();
    if (this.modifica === true) {
      this.onEdit(this.dataInstance);
    }
  }

  crea(): FormGroup {
    if (this.modifica === true) {
      return this.fb.group({
        id: [],
        idAnagraficaIndirizzo: [],
        istat: [],
        nazione: [''],
        cap: [''],
        comune: [''],
        provincia: [''],
        via: [''],
        civico: [''],
        descrizione: [''],
        idTipologia: [''],
        predefinito: ['']
      });
    } else {
      return this.fb.group({
        istat: [],
        nazione: [''],
        cap: [''],
        comune: [''],
        provincia: [''],
        via: [''],
        civico: [''],
        descrizione: [''],
        idTipologia: [''],
        predefinito: ['']
      });
    }
  }

  checkPrincipale(i: number = 0): void {
    const asFormArray = this.questoForm.get('parentForm') as FormArray;
    for (let x = 0; x <= (asFormArray.length - 1); x++) {
      if (this.parentForm.at(x).get('predefinito').value === true && x !== i) {
        this.parentForm.at(x).get('predefinito').patchValue(false);
      }
    }
  }

  isTouched(i: number = 0): void {
    this.parentForm.at(i).get('nazione').setValidators(Validators.required);
    this.parentForm.at(i).get('cap').setValidators(Validators.required);
    this.parentForm.at(i).get('comune').setValidators(Validators.required);
    this.parentForm.at(i).get('provincia').setValidators(Validators.required);
    this.parentForm.at(i).get('via').setValidators(Validators.required);
    this.parentForm.at(i).get('civico').setValidators(Validators.required);
    this.parentForm.at(i).get('idTipologia').setValidators(Validators.required);

    this.parentForm.at(i).get('nazione').updateValueAndValidity();
    this.parentForm.at(i).get('cap').updateValueAndValidity();
    this.parentForm.at(i).get('comune').updateValueAndValidity();
    this.parentForm.at(i).get('provincia').updateValueAndValidity();
    this.parentForm.at(i).get('via').updateValueAndValidity();
    this.parentForm.at(i).get('civico').updateValueAndValidity();
    this.parentForm.at(i).get('idTipologia').updateValueAndValidity();
  }

  unTouche(i: number = 0): void {
    this.parentForm.at(i).get('nazione').clearValidators();
    this.parentForm.at(i).get('cap').clearValidators();
    this.parentForm.at(i).get('comune').clearValidators();
    this.parentForm.at(i).get('provincia').clearValidators();
    this.parentForm.at(i).get('via').clearValidators();
    this.parentForm.at(i).get('civico').clearValidators();
    this.parentForm.at(i).get('idTipologia').clearValidators();

    this.parentForm.at(i).get('nazione').updateValueAndValidity();
    this.parentForm.at(i).get('cap').updateValueAndValidity();
    this.parentForm.at(i).get('comune').updateValueAndValidity();
    this.parentForm.at(i).get('provincia').updateValueAndValidity();
    this.parentForm.at(i).get('via').updateValueAndValidity();
    this.parentForm.at(i).get('civico').updateValueAndValidity();
    this.parentForm.at(i).get('idTipologia').updateValueAndValidity();
  }

  tipologiaIndirizzo(): void {
    this.apiTipologia.filterByID(3).subscribe(data => {
      this.tipologieIndirizzo = data.all_children;
    });
  }

  autocompleteOnCAP(CAP, i: number): void {
    this.apiIndirizzo.getCAP(CAP).subscribe(resp => {
      this.multiCAP[i] = resp;
      if (resp.length < 1) {
        const inputCAP = this.parentForm.at(i).get('cap').value;
        this.toastrService.info('Inserire il Comune manualmente', 'CAP ' + inputCAP + ' non trovato!');
        this.multiCAP[i] = [];
      } else if (resp.length > 1) {
        this.parentForm.at(i).get('istat').patchValue(resp[0].istat);
        this.parentForm.at(i).get('nazione').patchValue(resp[0].nazione);
        this.parentForm.at(i).get('provincia').patchValue(resp[0].provincia);
      } else {
        this.parentForm.at(i).get('istat').patchValue(resp[0].istat);
        this.parentForm.at(i).get('nazione').patchValue(resp[0].nazione);
        this.parentForm.at(i).get('provincia').patchValue(resp[0].provincia);
        setTimeout(() => {
          this.parentForm.at(i).get('comune').patchValue(resp[0].comune);
        });
      }
    },
      () => {
        this.multiCAP[i] = [];
      });
  }

  cleanField(i: number = 0) {
    this.parentForm.at(i).get('istat').reset();
    this.parentForm.at(i).get('nazione').reset();
    this.parentForm.at(i).get('provincia').reset();
    this.parentForm.at(i).get('comune').reset();
    this.multiCAP[i] = [];
  }

  onEdit(data): void {
    this.cardAccent = (this.origin === 'crud') ? 'warning' : '';
    this.UNonEdit = data.modificaDati.subscribe(resp => {
      this.parentForm.reset();

      setTimeout(() => {
        if ((resp.indirizzo !== undefined) && (resp.indirizzo.length > 0)) {
          const flags = this.indirizzoCreaPipe.transform(resp.indirizzo, true);
          this.parentForm.at(0).get('id').patchValue(resp.indirizzo[0].id);
          if (resp.indirizzo[0].idAnagraficaIndirizzo !== undefined) {
            this.parentForm.at(0).get('idAnagraficaIndirizzo').patchValue(resp.indirizzo[0].idAnagraficaIndirizzo);
          }
          this.parentForm.at(0).get('comune').patchValue(resp.indirizzo[0].comune);
          this.parentForm.at(0).get('provincia').patchValue(resp.indirizzo[0].provincia);
          this.parentForm.at(0).get('nazione').patchValue(resp.indirizzo[0].nazione);
          this.parentForm.at(0).get('cap').patchValue(resp.indirizzo[0].cap);
          this.parentForm.at(0).get('via').patchValue(resp.indirizzo[0].via);
          this.parentForm.at(0).get('civico').patchValue(resp.indirizzo[0].civico);
          this.parentForm.at(0).get('descrizione').patchValue(resp.indirizzo[0].descrizione);
          this.parentForm.at(0).get('idTipologia').patchValue(resp.indirizzo[0].idTipologia);
          this.parentForm.at(0).get('predefinito').patchValue(flags[0].predefinito);
          if (resp.indirizzo.length > 1) {
            for (let i = 1; i < resp.indirizzo.length; i++) {
              if (this.parentForm.length < resp.indirizzo.length) { this.add(); }
              this.parentForm.at(i).get('id').patchValue(resp.indirizzo[i].id);
              if (resp.indirizzo[i].idAnagraficaIndirizzo !== undefined) {
                this.parentForm.at(i).get('idAnagraficaIndirizzo').patchValue(resp.indirizzo[i].idAnagraficaIndirizzo);
              }
              this.parentForm.at(i).get('comune').patchValue(resp.indirizzo[i].comune);
              this.parentForm.at(i).get('provincia').patchValue(resp.indirizzo[i].provincia);
              this.parentForm.at(i).get('nazione').patchValue(resp.indirizzo[i].nazione);
              this.parentForm.at(i).get('cap').patchValue(resp.indirizzo[i].cap);
              this.parentForm.at(i).get('via').patchValue(resp.indirizzo[i].via);
              this.parentForm.at(i).get('civico').patchValue(resp.indirizzo[i].civico);
              this.parentForm.at(i).get('descrizione').patchValue(resp.indirizzo[i].descrizione);
              this.parentForm.at(i).get('idTipologia').patchValue(resp.indirizzo[i].idTipologia);
              this.parentForm.at(i).get('predefinito').patchValue(flags[i].predefinito);
            }
          }
        } else if (resp[0] !== undefined) {
          this.parentForm.at(0).get('id').patchValue(resp[0].id);
          this.parentForm.at(0).get('comune').patchValue(resp[0].comune);
          this.parentForm.at(0).get('provincia').patchValue(resp[0].provincia);
          this.parentForm.at(0).get('nazione').patchValue(resp[0].nazione);
          this.parentForm.at(0).get('cap').patchValue(resp[0].cap);
          this.parentForm.at(0).get('via').patchValue(resp[0].via);
          this.parentForm.at(0).get('civico').patchValue(resp[0].civico);
        } else {
          console.warn('Nessun indirizzo collegato!');
        }
      }, 300);

    });
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());

      this.outForm.emit(this.parentForm);
    } else {
      alert('Non puoi aggiungere più di ' + this.max + ' indirizzi');
    }
  }

  remove(i: number = 0): void {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
  }

  ngOnDestroy(): void {
    if (this.UNonEdit) {
      this.UNonEdit.unsubscribe();
    }
  }

}
