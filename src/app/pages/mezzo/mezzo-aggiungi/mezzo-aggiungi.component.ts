import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MezzoService } from 'src/app/API/mezzo/mezzo.service';
import { NbToastrService } from '@nebular/theme';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MezzoPipe } from 'src/app/API/PIPES/mezzo/mezzo.pipe';

@Component({
  selector: 'app-mezzo-aggiungi',
  templateUrl: './mezzo-aggiungi.component.html',
  styleUrls: ['./mezzo-aggiungi.component.less']
})
export class MezzoAggiungiComponent implements OnInit {

  myForm: FormGroup;

  modifica: boolean;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public apiMezzo: MezzoService,
    private mezzoPipe: MezzoPipe,
    private toastrService: NbToastrService,
    private router: Router,
    private location: Location) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      veicolo: this.fb.array([]),
      note: this.fb.array([])
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
      this.apiMezzo.filterByID(urlID);
    }
  }

  onSubmit() {
    if (this.modifica === true) {
      this.apiMezzo.putMezzo(this.mezzoPipe.transformInserimento(this.myForm.value)).subscribe(
        resp => {
          this.toastrService.success('ID mezzo: ' + resp, 'Mezzo modificato correttamente!');
          this.router.navigate(['/pages/mezzo/lista']);
        }, error => {
          this.toastrService.danger(error, 'Mezzo NON modificato!');
          console.error(error);
        });
    } else {
      this.apiMezzo.addMezzo(this.mezzoPipe.transformInserimento(this.myForm.value)).subscribe(
        resp => {
          this.toastrService.success('ID mezzo: ' + resp, 'Mezzo aggiunto correttamente!');
          this.router.navigate(['/pages/mezzo/lista']);
        }, error => {
          this.toastrService.danger(error, 'Mezzo NON aggiunto!');
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
