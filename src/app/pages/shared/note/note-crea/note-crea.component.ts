import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as env from 'src/environments/env';

@Component({
  selector: 'shared-note-crea',
  templateUrl: './note-crea.component.html',
  styleUrls: ['./note-crea.component.less']
})
export class NoteCreaComponent implements OnInit, OnDestroy {

  env = env;

  @Output() outForm = new EventEmitter<FormArray>();

  @Input() parentForm: any;

  @Input() max = 99;

  @Input() modifica = false;
  @Input() origin = 'crud';
  cardAccent: string;
  @Input() dataInstance: any;
  @Input() duplicato: boolean;

  questoForm: FormGroup;

  UNonEdit;
  operatore = [];
  dataModifica = [];

  constructor(private fb: FormBuilder, private datePipe: DatePipe) {
    this.questoForm = this.fb.group({});

  }

  ngOnInit() {
    if (this.origin == 'crud') { this.cardAccent = 'success' } else { this.cardAccent = '' };
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();
    if (this.modifica == true) {
      this.onEdit(this.dataInstance);
    }
    if (this.duplicato == true) {
      this.onEdit(this.dataInstance);
    }
  }

  crea(): FormGroup {
    if (this.modifica == true) {
      return this.fb.group({
        id: [],
        testo: ['']
      });
    } else {
      return this.fb.group({
        testo: ['']
      });
    }
  }

  onEdit(data) {
    this.cardAccent = (this.origin === 'crud') ? 'warning' : '';
    this.UNonEdit = data.modificaDati.subscribe(resp => {
      this.parentForm.reset();
      if (resp.nota !== undefined && resp.nota[0]) {
        if (this.modifica === true) { this.parentForm.at(0).get('id').patchValue(resp.nota[0].id); }
        this.parentForm.at(0).get('testo').patchValue(resp.nota[0].testo);
        this.operatore[0] = resp.nota[0].operatore;
        this.dataModifica[0] = this.datePipe.transform(resp.nota[0].updated_at, 'dd/MM/yyyy  hh:mm', '+03');

        if (resp.nota.length > 1) {
          for (let i = 1; i < resp.nota.length; i++) {
            if (this.parentForm.length < resp.nota.length) { this.add(); }
            if (this.modifica === true) {
              this.parentForm.at(i).get('id').patchValue(resp.nota[i].id);
              this.operatore[i] = resp.nota[i].operatore;
              this.dataModifica[i] = this.datePipe.transform(resp.nota[i].updated_at, 'dd/MM/yyyy  hh:mm', '+03');
            }
            this.parentForm.at(i).get('testo').patchValue(resp.nota[i].testo);
          }
        }
      } else if (resp.note) {
        resp.note.forEach((nota, i) => {
          if (this.parentForm.length < resp.note.length) { this.add(); }
          this.parentForm.at(i).get('id').patchValue(nota.id);
          this.operatore[i] = nota.operatore;
          this.dataModifica[i] = this.datePipe.transform(nota.updated_at, 'dd/MM/yyyy hh:mm', '+03');
          this.parentForm.at(i).get('testo').patchValue(nota.testo);
        });
      } else {
        console.warn('Nessuna nota collegata!');
      }
    });
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      this.outForm.emit(this.parentForm);
    } else {
      alert("non puoi aggiungere più di " + this.max + " note")
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
