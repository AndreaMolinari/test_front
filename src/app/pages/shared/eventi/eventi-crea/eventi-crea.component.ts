import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'shared-eventi-crea',
  templateUrl: './eventi-crea.component.html',
  styleUrls: ['./eventi-crea.component.less']
})
export class EventiCreaComponent implements OnInit {
  @Output() outForm = new EventEmitter<FormArray>();
  @Input() parentForm: FormArray;
  @Input() max = 99;
  @Input() modifica: boolean;
  @Input() dataInstance: any;

  questoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();
    if (this.modifica === true) {
      this.onEdit(this.dataInstance);
    }
  }

  crea(): FormGroup {
    if (this.modifica === true) {
      return this.fb.group({
        id: [null],
        messaggio: ['', Validators.required],
        codice: ['', Validators.required],
        me: []
      });
    } else {
      return this.fb.group({
        messaggio: ['', Validators.required],
        codice: ['', Validators.required],
        me: []
      });
    }
  }

  onEdit(data): void {
    data.modificaDati.subscribe(resp => {
      setTimeout(() => {
        if ((resp.eventi !== undefined) && (resp.eventi.length > 0)) {

          this.parentForm.at(0).get('id').patchValue(resp.eventi[0].id);

          if (resp.eventi.length > 1) {
            for (let i = 1; i < resp.eventi.length; i++) {
              this.add();
            }
          }
        } else if (resp[0] !== undefined) {
          this.parentForm.at(0).get('id').patchValue(resp[0].id);
        } else {
          console.warn('Nessun evento collegato!');
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
      alert('Non puoi aggiungere più di ' + this.max + ' eventi');
    }
  }

  remove(i: number = 0): void {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
  }

}
