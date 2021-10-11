import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ContattoService } from 'src/app/API/contatto/contatto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contatto-aggiungi',
  templateUrl: './contatto-aggiungi.component.html',
  styleUrls: ['./contatto-aggiungi.component.less']
})
export class ContattoAggiungiComponent implements OnInit {

  myForm: FormGroup;

  modifica = false;

  constructor(
    private fb: FormBuilder,
    public apiContatto: ContattoService,
    private activatedRoute: ActivatedRoute,
    private toastrService: NbToastrService,
    private router: Router,
    private location: Location) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      contatto: this.fb.array([]),
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
      this.apiContatto.filterByID(urlID);
    }
  }

  onSubmit() {
    if (this.modifica === true) {
      this.apiContatto.putContatto(this.myForm.value.contatto[0]).subscribe(
        resp => {
          this.toastrService.success('ID contatto: ' + resp, 'Contatto modificato correttamente!');
          this.router.navigate(['/pages/contatto/lista']);
        }, error => {
          this.toastrService.danger(error, 'Contatto NON modificato!');
          console.error(error);
        });
    } else {
      this.apiContatto.addContatto(this.myForm.value.contatto[0]).subscribe(
        resp => {
          this.toastrService.success('ID contatto: ' + resp, 'Contatto aggiunto correttamente!');
          this.router.navigate(['/pages/contatto/lista']);
        }, error => {
          this.toastrService.danger(error, 'Contatto NON aggiunto correttamente!');
          console.error(error);
        });
    }
  }

  onReset() {
    if (this.modifica === true) {
      this.myForm.reset();
      this.onEdit();
    } else {
      this.myForm.reset();
    }
  }

}
