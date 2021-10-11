import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { AnagraficaService } from 'src/app/API/anagrafica/anagrafica.service';
import { AnagraficaPipe } from 'src/app/API/PIPES/anagrafica/anagrafica.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shared-brand-crea',
  templateUrl: './brand-crea.component.html',
  styleUrls: ['./brand-crea.component.less']
})
export class BrandCreaComponent implements OnInit, OnDestroy {
  @Output() outForm = new EventEmitter<FormArray>();
  @Input() parentForm: FormArray;
  @Input() max = 99;
  @Input() modifica = false;
  @Input() dataInstance: any;

  questoForm: FormGroup;

  anagraficheFornitore: any[] = [];
  tipologieBrand: any[] = [];

  UNonEdit: Subscription;

  constructor(
    private fb: FormBuilder,
    private apiAnagrafica: AnagraficaService,
    private anaPipe: AnagraficaPipe
  ) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit() {
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();
    this.getAnagrafiche();
    if (this.modifica === true) {
      this.onEdit(this.dataInstance);
    }
  }

  crea(): FormGroup {
    if (this.modifica === true) {
      return this.fb.group({
        id: [null],
        idFornitore: [''],
        marca: ['', Validators.required]
      });
    } else {
      return this.fb.group({
        idFornitore: [''],
        marca: ['', Validators.required]
      });
    }
  }

  getAnagrafiche(): void {
    this.apiAnagrafica.filterByTipologia(27).subscribe(resp => {
      this.anagraficheFornitore = this.anaPipe.transform(resp);
    });
  }

  onEdit(data): void {
    this.UNonEdit = data.modificaDati.subscribe(resp => {
      setTimeout(() => {
        if ((resp.brand !== undefined) && (resp.brand.length > 0)) {
          this.parentForm.at(0).get('id').patchValue(resp.brand[0].id);
          this.parentForm.at(0).get('idFornitore').patchValue(resp.brand[0].idFornitore);
          this.parentForm.at(0).get('marca').patchValue(resp.brand[0].marca);
        } else if (resp.id !== undefined) {
          this.parentForm.at(0).get('id').patchValue(resp.id);
          this.parentForm.at(0).get('idFornitore').patchValue(resp.idFornitore);
          this.parentForm.at(0).get('marca').patchValue(resp.marca);
        } else {
          console.error('Nessun brand collegato!');
        }
      });
    })
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      this.outForm.emit(this.parentForm);
    } else {
      alert('Non puoi aggiungere più di ' + this.max + ' brand');
    }
  }

  remove(i): void {
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
