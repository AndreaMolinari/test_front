import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { TipologiaService } from 'src/app/API/tipologia/tipologia.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Location } from '@angular/common';

@Component({
  selector: 'app-tipologia-aggiungi',
  templateUrl: './tipologia-aggiungi.component.html',
  styleUrls: ['./tipologia-aggiungi.component.less']
})
export class TipologiaAggiungiComponent implements OnInit {

  myForm: FormGroup;

  modifica: boolean;

  constructor(
    private fb: FormBuilder,
    public apiTipologia: TipologiaService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: NbToastrService,
    private location: Location
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      tipologia: this.fb.array([]),
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
      this.apiTipologia.modificaByID(urlID);
    }
  }

  onSubmit() {
    console.log(this.myForm.value);

    if (this.modifica === true) {
      this.apiTipologia.putTipologia(this.myForm.value.tipologia[0]).subscribe(
        resp => {
          this.toastrService.success('ID Servizio: ' + resp, 'Servizio modificato correttamente!');
          this.router.navigate(['/pages/tipologia/lista']);
        }, error => {
          this.toastrService.danger(error, 'Servizio NON modificato!');
          console.error(error);
        });
    } else {
      this.apiTipologia.addTipologia(this.myForm.value.tipologia[0]).subscribe(
        resp => {
          this.toastrService.success('ID Servizio: ' + resp, 'Servizio aggiunto correttamente!');
          this.router.navigate(['/pages/tipologia/lista']);
        }, error => {
          this.toastrService.danger(error, 'Servizio NON aggiunto!');
          console.error(error);
        });
    }

  }

  onReset() {
    if (this.modifica === true) {
      this.onEdit();
    } else { this.myForm.reset(); }
  }

}
