import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TipologiaService } from 'src/app/API/tipologia/tipologia.service';
import { FatturazioneService } from 'src/app/API/fatturazione/fatturazione.service';
import { NbToastrService } from '@nebular/theme';
import { FatturazioneInserimentoPipe } from 'src/app/API/PIPES/fatturazione/fatturazione-inserimento.pipe';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'shared-fatturazione-crea',
  templateUrl: './fatturazione-crea.component.html',
  styleUrls: ['./fatturazione-crea.component.less']
})
export class FatturazioneCreaComponent implements OnInit, OnDestroy {
  env = environment;

  @Output() outForm = new EventEmitter<FormArray>();
  @Input() parentForm: FormArray;
  @Input() max = 99;
  @Input() modifica = false;
  @Input() origin = 'crud';
  @Input() dataInstance: any;

  cardAccent = 'basic';

  questoForm: FormGroup;

  arrayModFatturazione: any[] = [];
  arrayCadenzaFatturazione: any[] = [];
  arrayPeriodicitaFatturazione: any[] = [];

  UNonEdit: Subscription;

  constructor(
    private fb: FormBuilder,
    private apiTipologia: TipologiaService,
    private apiFatturazione: FatturazioneService,
    private toastrService: NbToastrService,
    private pipeFatturazioneCrea: FatturazioneInserimentoPipe) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.cardAccent = (this.origin === 'crud') ? 'success' : 'basic';
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();
    this.getmodFatturazione();
    this.getCadenzaFatturazione();
    if (this.modifica === true) {
      this.onEdit(this.dataInstance);
    }
  }

  crea(): FormGroup {
    if (this.modifica === true) {
      return this.fb.group({
        id: [],
        idModalita: [],
        idPeriodo: [],
        sdi: [],
        speseIncasso: [true],
        speseSpedizione: [true],
        splitPA: [false],
        esenteIVA: [false],

        banca: [],
        filiale: [],
        iban: [],
        iban_cin: [],
        iban_abi: [],
        iban_cab: [],
        pec: [],
        mail: []
      });
    } else {
      return this.fb.group({
        idModalita: [''],
        idPeriodo: [''],
        sdi: [''],
        speseIncasso: [true],
        speseSpedizione: [true],
        splitPA: [false],
        esenteIVA: [false],

        banca: [''],
        filiale: [''],
        iban: [''],
        iban_cin: [''],
        iban_abi: [''],
        iban_cab: [''],
        pec: [''],
        mail: ['']
      });
    }
  }

  getmodFatturazione(): void {
    this.apiTipologia.filterByID(38).subscribe(data => {
      this.arrayModFatturazione = data.all_children;
    });
  }
  getCadenzaFatturazione(): void {
    this.apiTipologia.filterByID(39).subscribe(data => {
      this.arrayCadenzaFatturazione = data.all_children;
    });
  }

  autocompleteOnIBAN($event, index: number = 0): void {
    this.apiFatturazione.getIBAN($event).subscribe(data => {
      console.log(data);
      if (data.length < 1) {
        this.toastrService.info('Inserire manualmente CIN, ABI e CAB', 'IBAN ' + $event + ' NON trovato o NON valido!');
      } else {
        this.parentForm.at(index).get('iban_cin').patchValue(data.cin);
        this.parentForm.at(index).get('iban_abi').patchValue(data.abi);
        this.parentForm.at(index).get('iban_cab').patchValue(data.cab);
      }
    }, error => {
      this.toastrService.danger(error.message, error.status + ' ERRORE CONNESSIONE AL SERVER: ');
      console.error(error);
    });
  }

  cleanField(index: number = 0): void {
    this.parentForm.at(index).get('iban_cin').reset();
    this.parentForm.at(index).get('iban_abi').reset();
    this.parentForm.at(index).get('iban_cab').reset();
  }

  onEdit(data): void {
    this.cardAccent = (this.origin === 'crud') ? 'warning' : 'basic';
    this.UNonEdit = data.modificaDati.subscribe(resp => {
      // this.parentForm.reset();

      setTimeout(() => {
        if ((resp.fatturazione !== undefined) && (resp.fatturazione.length > 0)) {
          const flags = this.pipeFatturazioneCrea.transform(resp.fatturazione, true);
          this.parentForm.at(0).get('id').patchValue(resp.fatturazione[0].id);
          this.parentForm.at(0).get('idModalita').patchValue(resp.fatturazione[0].idModalita.toString());
          this.parentForm.at(0).get('idPeriodo').patchValue(resp.fatturazione[0].idPeriodo.toString());
          this.parentForm.at(0).get('sdi').patchValue(resp.fatturazione[0].sdi);
          this.parentForm.at(0).get('speseIncasso').patchValue(flags[0].speseIncasso);
          this.parentForm.at(0).get('speseSpedizione').patchValue(flags[0].speseSpedizione);
          this.parentForm.at(0).get('splitPA').patchValue(flags[0].splitPA);
          this.parentForm.at(0).get('esenteIVA').patchValue(flags[0].esenteIVA);
          this.parentForm.at(0).get('pec').patchValue(resp.fatturazione[0].pec);
          this.parentForm.at(0).get('mail').patchValue(resp.fatturazione[0].mail);
          if (resp.fatturazione[0].idModalita == 41 || resp.fatturazione[0].idModalita == 42) {
            this.parentForm.at(0).get('banca').patchValue(resp.fatturazione[0].banca);
            this.parentForm.at(0).get('filiale').patchValue(resp.fatturazione[0].filiale);
            this.parentForm.at(0).get('iban').patchValue(resp.fatturazione[0].iban);
            this.parentForm.at(0).get('iban_abi').patchValue(resp.fatturazione[0].iban_abi);
            this.parentForm.at(0).get('iban_cab').patchValue(resp.fatturazione[0].iban_cab);
            this.parentForm.at(0).get('iban_cin').patchValue(resp.fatturazione[0].iban_cin);
          }
          if (resp.fatturazione.length > 1) {
            for (let i = 1; i < resp.fatturazione.length; i++) {
              this.add();
              this.parentForm.at(i).get('id').patchValue(resp.fatturazione[i].id);
              this.parentForm.at(i).get('idModalita').patchValue(resp.fatturazione[i].idModalita.toString());
              this.parentForm.at(i).get('idPeriodo').patchValue(resp.fatturazione[i].idPeriodo.toString());
              this.parentForm.at(i).get('sdi').patchValue(resp.fatturazione[i].sdi);
              this.parentForm.at(i).get('speseIncasso').patchValue(flags[i].speseIncasso);
              this.parentForm.at(i).get('speseSpedizione').patchValue(flags[i].speseSpedizione);
              this.parentForm.at(i).get('splitPA').patchValue(flags[i].splitPA);
              this.parentForm.at(i).get('esenteIVA').patchValue(flags[i].esenteIVA);
              this.parentForm.at(i).get('pec').patchValue(resp.fatturazione[i].pec);
              this.parentForm.at(i).get('mail').patchValue(resp.fatturazione[i].mail);
              if (resp.fatturazione[i].idModalita == 41 || resp.fatturazione[i].idModalita == 42) {
                this.parentForm.at(i).get('banca').patchValue(resp.fatturazione[i].banca);
                this.parentForm.at(i).get('filiale').patchValue(resp.fatturazione[i].filiale);
                this.parentForm.at(i).get('iban').patchValue(resp.fatturazione[i].iban);
                this.parentForm.at(i).get('iban_abi').patchValue(resp.fatturazione[i].iban_abi);
                this.parentForm.at(i).get('iban_cab').patchValue(resp.fatturazione[i].iban_cab);
                this.parentForm.at(i).get('iban_cin').patchValue(resp.fatturazione[i].iban_cin);
              }
            }
          }
        } else if (resp[0] !== undefined) {
          const flags = this.pipeFatturazioneCrea.transform(resp, true);
          this.parentForm.at(0).get('id').patchValue(resp[0].id);
          this.parentForm.at(0).get('idModalita').patchValue(resp[0].idModalita.toString());
          this.parentForm.at(0).get('idPeriodo').patchValue(resp[0].idPeriodo.toString());
          this.parentForm.at(0).get('sdi').patchValue(resp[0].sdi);
          this.parentForm.at(0).get('speseIncasso').patchValue(flags[0].speseIncasso);
          this.parentForm.at(0).get('speseSpedizione').patchValue(flags[0].speseSpedizione);
          this.parentForm.at(0).get('splitPA').patchValue(flags[0].splitPA);
          this.parentForm.at(0).get('esenteIVA').patchValue(flags[0].esenteIVA);
          this.parentForm.at(0).get('pec').patchValue(resp[0].pec);
          if (resp[0].idModalita == 41 || resp[0].idModalita == 42) {
            this.parentForm.at(0).get('banca').patchValue(resp[0].banca);
            this.parentForm.at(0).get('filiale').patchValue(resp[0].filiale);
            this.parentForm.at(0).get('iban').patchValue(resp[0].iban);
            this.parentForm.at(0).get('iban_abi').patchValue(resp[0].iban_abi);
            this.parentForm.at(0).get('iban_cab').patchValue(resp[0].iban_cab);
            this.parentForm.at(0).get('iban_cin').patchValue(resp[0].iban_cin);
          }
        } else {
          console.warn('Nessuna fatturazione collegata!');
        }
      });
    });
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      this.outForm.emit(this.parentForm);
    } else {
      alert('Non puoi aggiungere più di ' + this.max + ' dati di fatturazione');
    }
  }

  remove(i: number = 0): void {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    if (this.parentForm.length === 0) {
      this.add();
    }
    this.outForm.emit(this.parentForm);
  }

  ngOnDestroy(): void {
    if (this.UNonEdit) { this.UNonEdit.unsubscribe(); }
  }

}
