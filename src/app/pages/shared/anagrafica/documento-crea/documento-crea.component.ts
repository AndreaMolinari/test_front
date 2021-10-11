import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'shared-documento-crea',
  templateUrl: './documento-crea.component.html',
  styleUrls: ['./documento-crea.component.less']
})
export class DocumentoCreaComponent implements OnInit {

  @Output() outForm = new EventEmitter<FormArray>();
  @Input() parentForm: FormArray;
  @Input() max = 99;
  @Input() dataInstance: any;

  questoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();
  }

  crea(): FormGroup {
    return this.fb.group({
      idTipologia: [],
      seriale: [''],
      dataScadenza: [],
      descrizione: [''],
      file: new FormData()
    });
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());

      this.outForm.emit(this.parentForm);
    } else {
      alert('non puoi aggiungere più di ' + this.max + ' file');
    }
  }

  remove(i: number): void {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
  }

  caricaFile($event, index: number): void {
    console.log($event.target.files[0]);
    this.parentForm.at(0).get('file').setValue($event.target.files[0]);
    console.log('ParentForm', this.parentForm.value);
  }

}
