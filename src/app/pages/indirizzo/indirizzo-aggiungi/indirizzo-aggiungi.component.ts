import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IndirizzoService } from 'src/app/API/indirizzo/indirizzo.service';
import { NbToastrService } from '@nebular/theme';
import { Location } from '@angular/common';

@Component({
  selector: 'app-indirizzo-aggiungi',
  templateUrl: './indirizzo-aggiungi.component.html',
  styleUrls: ['./indirizzo-aggiungi.component.less']
})
export class IndirizzoAggiungiComponent implements OnInit {

  myForm: FormGroup;

  modifica = false;

  constructor(
    private fb: FormBuilder,
    public apiIndirizzo: IndirizzoService,
    private activatedRoute: ActivatedRoute,
    private toastrService: NbToastrService,
    private location: Location) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      indirizzo: this.fb.array([]),
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
      this.apiIndirizzo.filterByID(urlID);
    }
  }

  onSubmit() {
    if (this.modifica === true) {
      this.apiIndirizzo.putIndirizzo(this.myForm.value.indirizzo[0]).subscribe(
        resp => {
          this.myForm.value.indirizzo.push(resp);
          this.toastrService.success('ID indirizzo:' + resp, 'Indirizzo modificato correttamente!');
        }, error => {
          this.toastrService.danger(error, 'Indirizzo NON modificato!');
          console.error(error);
        });
    } else {
      this.apiIndirizzo.addIndirizzo(this.myForm.value.indirizzo[0]).subscribe(
        resp => {
          this.myForm.value.indirizzo.push(resp);
          this.toastrService.success('ID indirizzo:' + resp, 'Indirizzo aggiunto correttamente!');
        }, error => {
          this.toastrService.danger(error, 'Indirizzo NON aggiunto!');
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
