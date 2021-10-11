import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { UtenteService } from 'src/app/API/utente/utente.service';
import { NbToastrService } from '@nebular/theme';
import { Md5 } from 'ts-md5/dist/md5';
import { ActivatedRoute, Router } from '@angular/router';
import { UtentePipe } from 'src/app/API/PIPES/utente/utente.pipe';
import { Location } from '@angular/common';

@Component({
  selector: 'app-utente-aggiungi',
  templateUrl: './utente-aggiungi.component.html',
  styleUrls: ['./utente-aggiungi.component.less']
})
export class UtenteAggiungiComponent implements OnInit {

  myForm: FormGroup;
  modifica: boolean;

  constructor(
    private fb: FormBuilder,
    public apiUtente: UtenteService,
    private toastrService: NbToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private utentePipe: UtentePipe,
    private location: Location
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      utente: this.fb.array([]),
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
      this.apiUtente.filterByID(urlID);
    }
  }

  onSubmit() {
    console.log(this.myForm.value.utente);
    const submitData = this.utentePipe.transformInserimento(this.myForm.value.utente, false)

    if (this.modifica === true) {
      this.apiUtente.putUtente(submitData[0]).subscribe(
        resp => {
          this.toastrService.success('ID utente: ' + resp, 'Utente modificato correttamente!');
          this.router.navigate(['/pages/utente/lista']);
        }, error => {
          this.toastrService.danger(error, 'Utente NON aggiunto!');
          console.error(error);
        });
    } else {
      this.apiUtente.addUtente(submitData[0]).subscribe(
        resp => {
          this.toastrService.success('ID utente: ' + resp, 'Utente aggiunto correttamente!');
          this.router.navigate(['/pages/utente/lista']);
        }, error => {
          this.toastrService.danger(error, 'Utente NON aggiunto!');
          console.error(error);
        });
    }
  }

  onReset() {
    this.myForm.reset();
  }

}
