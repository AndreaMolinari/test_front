import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { ComponentePipe } from 'src/app/API/PIPES/componente/componente.pipe';
import { TachoService } from 'src/app/API/tacho/tacho.service';

@Component({
  selector: 'app-tacho-aggiungi',
  templateUrl: './tacho-aggiungi.component.html',
  styleUrls: ['./tacho-aggiungi.component.less']
})
export class TachoAggiungiComponent implements OnInit {

  myForm: FormGroup;

  modifica: boolean;

  constructor(
    private fb: FormBuilder,
    public apiTacho: TachoService,
    public componentePipe: ComponentePipe,
    private activatedRoute: ActivatedRoute,
    private toastrService: NbToastrService,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      tacho: this.fb.array([]),
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
      this.apiTacho.filterByID(urlID);
    }
  }

  onSubmit() {
    if (this.modifica === true) {
      this.apiTacho.putTacho(this.componentePipe.transformInserimentoSpecialTacho(this.myForm.value)).subscribe(
        resp => {
          this.toastrService.success('ID tachigrafo: ' + resp, 'Tachigrafo modificato correttamente!');
          this.router.navigate(['/pages/tacho/lista']);
        }, error => {
          this.toastrService.danger(error, 'Tachigrafo NON modificato!');
          console.error(error);
        });
    } else {
      this.apiTacho.addTacho(this.componentePipe.transformInserimentoSpecialTacho(this.myForm.value)).subscribe(
        resp => {
          this.toastrService.success('ID tachigrafo: ' + resp, 'Tachigrafo aggiunto correttamente!');
          this.router.navigate(['/pages/tacho/lista']);
        }, error => {
          this.toastrService.danger(error, 'Tachigrafo NON aggiunto!');
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
