import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-note-aggiungi',
  templateUrl: './note-aggiungi.component.html',
  styleUrls: ['./note-aggiungi.component.less']
})
export class NoteAggiungiComponent implements OnInit {

  myForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      anagrafica: this.fb.array([]),
      indirizzo: this.fb.array([]),
      fatturazione: this.fb.array([]),

      utente: this.fb.array([]),
      contatto: this.fb.array([]),
      note: this.fb.array([]),
    })
  }

  addFormGroup(name: string, form: FormArray) {
    this.myForm.setControl(name, form);
  }

  onSubmit() { }

  onReset() {
    this.myForm.reset();
  }

}
