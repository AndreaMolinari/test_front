import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { RadiocomandoService } from 'src/app/API/radiocomando/radiocomando.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Location } from '@angular/common';

@Component({
  selector: 'app-radiocomando-aggiungi',
  templateUrl: './radiocomando-aggiungi.component.html',
  styleUrls: ['./radiocomando-aggiungi.component.less']
})
export class RadiocomandoAggiungiComponent implements OnInit {

  myForm: FormGroup;

  modifica: boolean;

  constructor(
    private fb: FormBuilder,
    public apiRadiocomando: RadiocomandoService,
    private activatedRoute: ActivatedRoute,
    private toastrService: NbToastrService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      radiocomando: this.fb.array([]),
      nota: this.fb.array([])
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
      this.apiRadiocomando.filterByID(urlID);
    }
  }

  onSubmit() {
    if (this.modifica === true) {
      const newForm = this.myForm.value.radiocomando[0];
      newForm.nota = (this.myForm.value.nota && this.myForm.value.nota[0].testo) ? this.myForm.value.nota : null;
      this.apiRadiocomando.putRadiocomando(newForm).subscribe(
        resp => {
          this.toastrService.success('ID radiocomando: ' + resp, 'Radiocomando modificato correttamente!');
          this.router.navigate(['/pages/radiocomando/lista']);
        }, error => {
          this.toastrService.danger(error, 'Radiocomando NON modificato!');
          console.error(error);
        });
    } else {
      const newForm = this.myForm.value.radiocomando[0];
      newForm.nota = (this.myForm.value.nota && this.myForm.value.nota[0].testo) ? this.myForm.value.nota : null;
      this.apiRadiocomando.addRadiocomando(newForm).subscribe(
        resp => {
          this.toastrService.success('ID radiocomando: ' + resp, 'Radiocomando aggiunto correttamente!');
          this.router.navigate(['/pages/radiocomando/lista']);
        }, error => {
          this.toastrService.danger(error, 'Radiocomando NON aggiunto!');
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
