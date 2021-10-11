import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { BrandService } from 'src/app/API/brand/brand.service';

@Component({
  selector: 'shared-brand-modal',
  templateUrl: './brand-modal.component.html',
  styleUrls: ['./brand-modal.component.less']
})
export class BrandModalComponent implements OnInit {

  myForm: FormGroup;

  loadingData: boolean;

  constructor(private fb: FormBuilder, private dialogRef: NbDialogRef<any>, private apiBrand: BrandService) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      brand: this.fb.array([]),
    });
  }

  addFormGroup(name: string, form: FormArray) {
    this.myForm.setControl(name, form);
  }

  onSubmit() {
    this.loadingData = true;
    console.log(this.myForm.value.brand[0]);
    this.apiBrand.addBrand(this.myForm.value.brand[0]).subscribe(
      resp => {
        this.loadingData = false;
        this.dialogRef.close({ id: resp.id, marca: this.myForm.value.brand[0].marca });
      },
      error => { alert('Errore'); }
    );
  }

  onReset() {
    this.myForm.reset();
  }

}
