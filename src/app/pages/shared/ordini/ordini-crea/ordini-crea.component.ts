import { Component, OnInit, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'shared-ordini-crea',
  templateUrl: './ordini-crea.component.html',
  styleUrls: ['./ordini-crea.component.less']
})
export class OrdiniCreaComponent implements OnInit, OnDestroy {

  @Output() outForm = new EventEmitter<FormArray>();

  @Input() parentForm: FormArray;
  @Input() max: number = 99;
  @Input() modifica: boolean = false;
  @Input() dataInstance: any;
  cardAccent: string = 'success';

  questoForm: FormGroup;

  UNonModifica;

  constructor(private fb: FormBuilder) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit() {
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();
    if (this.modifica == true) {
      this.onEdit(this.dataInstance);
    }
  }

  crea(): FormGroup {
    if (this.modifica == true) {
      return this.fb.group({
        id: [],
        //! Campi quando sono in modifica
      });
    }
    return this.fb.group({
      //! Campi quando sono in aggiungi
    });
  }

  onEdit(data) {
    this.cardAccent = 'warning';
    this.UNonModifica = data.modificaDati.subscribe(data => {
      console.log("MODIFICA/ordine", data)
      if (data != undefined) {
        this.parentForm.at(0).get('id').patchValue(data[0].id);
      }
    })
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      this.outForm.emit(this.parentForm);
    } else {
      alert("non puoi aggiungere più di " + this.max + " ordini")
    }
  }

  remove(i) {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
  }

  ngOnDestroy() {
    if (this.UNonModifica) { this.UNonModifica.unsubscribe(); }
  }

}
