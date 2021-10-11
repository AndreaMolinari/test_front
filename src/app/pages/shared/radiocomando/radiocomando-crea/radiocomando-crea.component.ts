import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { ModelloService } from 'src/app/API/modello/modello.service';

@Component({
  selector: 'shared-radiocomando-crea',
  templateUrl: './radiocomando-crea.component.html',
  styleUrls: ['./radiocomando-crea.component.less']
})
export class RadiocomandoCreaComponent implements OnInit {

  @Output() outForm = new EventEmitter<FormArray>();

  @Input() parentForm: FormArray;

  @Input() max = 99;

  @Input() modifica = false;
  @Input() dataInstance: any;

  questoForm: FormGroup;

  arrayModello = [];

  constructor(private fb: FormBuilder, private apiModello: ModelloService) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit() {
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();
    this.getModelli();
    if (this.modifica === true) {
      this.onEdit(this.dataInstance);
    }
  }

  crea(): FormGroup {
    if (this.modifica === true) {
      return this.fb.group({
        id: [],
        idModello: ['', Validators.required],
        unitcode: ['', Validators.required]
      });
    } else {
      return this.fb.group({
        idModello: ['', Validators.required],
        unitcode: ['', Validators.required]
      });
    };
  }

  getModelli() {
    this.apiModello.filterByTipologia(93).subscribe(data => {
      this.arrayModello = data;
    });
  }

  onEdit(data) {
    data.modificaDati.subscribe(resp => {
      console.log('MODIFICA/radiodomando', resp);
      setTimeout(() => {
        if ((resp.radiocomando !== undefined) && (resp.radiocomando.length > 0)) {
          this.parentForm.at(0).get('id').patchValue(resp.radiocomando[0].id);
          this.parentForm.at(0).get('idModello').patchValue(resp.radiocomando[0].idModello);
          this.parentForm.at(0).get('unitcode').patchValue(resp.radiocomando[0].unitcode);
        } else if (resp[0] !== undefined) {
          this.parentForm.at(0).get('id').patchValue(resp[0].id);
          this.parentForm.at(0).get('idModello').patchValue(resp[0].idModello);
          this.parentForm.at(0).get('unitcode').patchValue(resp[0].unitcode);
        } else {
          console.log('Nessun radiocomando collegato!');
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
      alert('Non puoi aggiungere più di ' + this.max + ' dispositivi');
    }
  }

  remove(i) {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
  }


}
