import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ddt-aggiungi',
  templateUrl: './ddt-aggiungi.component.html',
  styleUrls: ['./ddt-aggiungi.component.less']
})
export class DdtAggiungiComponent implements OnInit {

  myForm: FormGroup;
  modifica: boolean;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private toastrService: NbToastrService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      ddt: this.fb.array([])
    })
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
      // ! API.filterbyID(urlID);
    }
  }

  onSubmit() {
    if (this.modifica === true) { }
  }

  onReset() {
    if (this.modifica === true) {
      this.onEdit();
    } else {
      this.myForm.reset();
    }
  }

}
