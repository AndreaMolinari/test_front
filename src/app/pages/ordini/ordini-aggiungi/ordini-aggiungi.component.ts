import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrModule } from '@nebular/theme';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ordini-aggiungi',
  templateUrl: './ordini-aggiungi.component.html',
  styleUrls: ['./ordini-aggiungi.component.less']
})
export class OrdiniAggiungiComponent implements OnInit {

  myForm: FormGroup;
  modifica: boolean;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private toastrService: NbToastrModule,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      ordine: this.fb.array([]),
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
