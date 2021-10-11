import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { BrandService } from 'src/app/API/brand/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Location } from '@angular/common';

@Component({
  selector: 'app-brand-aggiungi',
  templateUrl: './brand-aggiungi.component.html',
  styleUrls: ['./brand-aggiungi.component.less']
})
export class BrandAggiungiComponent implements OnInit {

  myForm: FormGroup;

  modifica: boolean;

  constructor(
    private fb: FormBuilder,
    public apiBrand: BrandService,
    private activatedRoute: ActivatedRoute,
    private toastrService: NbToastrService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      brand: this.fb.array([]),
    });
    this.onEdit();
  }

  goBack() {
    this.location.back();
  }

  addFormGroup(name: string, form: FormArray) {
    this.myForm.setControl(name, form);
  }

  onEdit() {
    const urlID = this.activatedRoute.snapshot.paramMap.get('id');
    if (urlID !== null) {
      this.modifica = true;
      this.apiBrand.filterByID(urlID);
    }
  }

  onSubmit() {
    if (this.modifica === true) {
      this.apiBrand.putBrand(this.myForm.value.brand[0]).subscribe(
        resp => {
          this.toastrService.success('ID brand: ' + resp, 'Brand modificato correttamente!')
          this.router.navigate(['/pages/brand/lista']);
        }, error => {
          this.toastrService.danger(error, 'Brand NON modificato!');
          console.error(error);
        });
    } else {
      this.apiBrand.addBrand(this.myForm.value.brand[0]).subscribe(
        resp => {
          this.toastrService.success('ID brand: ' + resp, 'Brand aggiunto correttamente!')
          this.router.navigate(['/pages/brand/lista']);
        }, error => {
          this.toastrService.danger(error, 'Brand NON aggiunto!');
          console.error(error);
        });
    }
  }

  onReset() {
    if (this.modifica === true) {
      this.onEdit();
    } else {
      this.myForm.reset();
    }
  }

}
