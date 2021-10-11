import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { ModelloService } from 'src/app/API/modello/modello.service';

@Component({
  selector: 'shared-modello-modal',
  templateUrl: './modello-modal.component.html',
  styleUrls: ['./modello-modal.component.less']
})
export class ModelloModalComponent implements OnInit {

  myForm: FormGroup;

  loadingData: Boolean;

  constructor(private fb: FormBuilder, private _ref: NbDialogRef<any>, private _apiModello: ModelloService) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      modello: this.fb.array([]),
    })
  }

  addFormGroup(name: string, form: FormArray) {
    this.myForm.setControl(name, form);
  }

  onSubmit() {
    this.loadingData = true;
    console.log(this.myForm.value.modello[0]);
    this._apiModello.addModello(this.myForm.value.modello[0]).subscribe(
      resp => {
        this.loadingData = false;
        this._ref.close({ "id": resp.id, "modello": this.myForm.value.modello[0].modello });
      },
      error => { alert("Errore") });
  }

  onReset() {
    this.myForm.reset();
  }

}
