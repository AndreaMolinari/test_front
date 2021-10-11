import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { FatturazioneService } from 'src/app/API/fatturazione/fatturazione.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-fatturazione-aggiungi',
  templateUrl: './fatturazione-aggiungi.component.html',
  styleUrls: ['./fatturazione-aggiungi.component.less']
})
export class FatturazioneAggiungiComponent implements OnInit {

  myForm: FormGroup;

  modifica: boolean;

  constructor(
    private fb: FormBuilder,
    public fatturaService: FatturazioneService,
    private toastrService: NbToastrService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      fatturazione: this.fb.array([]),
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
      this.fatturaService.filterByID(urlID);
    }
  }

  onSubmit() {
    if (this.modifica === true) {
      this.fatturaService.putFattura(this.myForm.value.fatturazione[0])
        .subscribe(resp => {
          this.toastrService.success('ID fattura:' + resp, 'Fattura modificata correttamente!');
        }, error => {
          this.toastrService.danger(error, 'Fattura NON modificata!');
          console.error(error);
        });
    } else {
      this.fatturaService.addFattura(this.myForm.value.fatturazione[0])
        .subscribe(resp => {
          this.toastrService.success('ID fattura:' + resp, 'Fattura aggiunta correttamente!');
        }, error => {
          this.toastrService.danger(error, 'Fattura NON aggiunta!');
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
