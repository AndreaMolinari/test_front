import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ModelloService } from 'src/app/API/modello/modello.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Location } from '@angular/common';

@Component({
  selector: 'app-modello-aggiungi',
  templateUrl: './modello-aggiungi.component.html',
  styleUrls: ['./modello-aggiungi.component.less']
})
export class ModelloAggiungiComponent implements OnInit {

  myForm: FormGroup;

  modifica: boolean;

  constructor(
    private fb: FormBuilder,
    public apiModello: ModelloService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: NbToastrService,
    private location: Location
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      modello: this.fb.array([]),
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
      this.apiModello.filterByID(urlID);
    }
  }

  onSubmit() {
    if (this.modifica === true) {
      this.apiModello.putModello(this.myForm.value.modello[0]).subscribe(
        resp => {
          this.toastrService.success('ID modello:' + resp, 'Modello modificato correttamente!');
          this.router.navigate(['/pages/modello/lista']);
        }, error => {
          console.error(error);
          this.toastrService.danger(error, 'Modello NON modificato!');
        });
    } else {
      this.apiModello.addModello(this.myForm.value.modello[0]).subscribe(
        resp => {
          this.toastrService.success('ID modello:' + resp, 'Modello aggiunto correttamente!');
          this.router.navigate(['/pages/modello/lista']);
        }, error => {
          console.error(error);
          this.toastrService.danger(error, 'Modello NON aggiunto!');
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
