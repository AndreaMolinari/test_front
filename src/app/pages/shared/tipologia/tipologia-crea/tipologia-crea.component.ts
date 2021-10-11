import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TipologiaService } from 'src/app/API/tipologia/tipologia.service';
import { isArray } from 'util';

@Component({
  selector: 'shared-tipologia-crea',
  templateUrl: './tipologia-crea.component.html',
  styleUrls: ['./tipologia-crea.component.less']
})
export class TipologiaCreaComponent implements OnInit {

  @Output() outForm = new EventEmitter<FormArray>();

  @Input() parentForm: FormArray;

  @Input() max: number = 1;

  @Input() modifica: boolean = false;
  @Input() dataInstance: any;

  questoForm: FormGroup;

  arrayParent: [];

  constructor(private fb: FormBuilder, private _apiTipologia: TipologiaService) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit() {
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();
    this.tipologiaParent();
    if (this.modifica == true) {
      this.onEdit(this.dataInstance);
    }
  }

  crea(): FormGroup {
    if (this.modifica == true) {
      return this.fb.group({
        id: [],
        idParent: [''],
        tipologia: ['', Validators.required],
        descrizione: ['']
      });
    } else {
      return this.fb.group({
        idParent: [''],
        tipologia: ['', Validators.required],
        descrizione: ['']
      });
    }
  }

  tipologiaParent() {
    this._apiTipologia.getAll().subscribe(data => {
      this.arrayParent = data;
    });
  }

  onEdit(data) {
    data.modificaDati.subscribe(data => {
      console.log("MODIFICA/tipologia", data)
      setTimeout(() => {
        if ((data.tipologia != undefined) && (isArray(data.tipologia)) && (data.tipologia.length > 0)) {
          this.parentForm.at(0).get('id').patchValue(data.tipologia[0].id);
          this.parentForm.at(0).get('idParent').patchValue(data.tipologia[0].idParent);
          this.parentForm.at(0).get('tipologia').patchValue(data.tipologia[0].tipologia);
          this.parentForm.at(0).get('descrizione').patchValue(data.tipologia[0].descrizione);
        } else if (data != undefined) {
          this.parentForm.at(0).get('id').patchValue(data.id);
          this.parentForm.at(0).get('idParent').patchValue(data.idParent);
          this.parentForm.at(0).get('tipologia').patchValue(data.tipologia);
          this.parentForm.at(0).get('descrizione').patchValue(data.descrizione);
        } else {
          console.log("nessun utente collegato!");
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
      alert("non puoi aggiungere più di " + this.max + " tipologie")
    }
  }

  remove(i) {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
  }

}
