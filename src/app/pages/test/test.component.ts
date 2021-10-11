import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, FormControl } from '@angular/forms';
import { ComponenteService } from 'src/app/API/componente/componente.service';
import { MezzoService } from 'src/app/API/mezzo/mezzo.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  myForm: FormGroup;

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  datiModifica = '8058';

  arrayMezzi = [];

  constructor(private fb: FormBuilder, private _apiComponente: ComponenteService, private _apiMezzo: MezzoService) { }

  addFormGroup(name: string, form: FormArray) {
    this.myForm.setControl(name, form);
  }

  ngOnInit() {
    
    this._apiMezzo.getAll().subscribe(data => {
      this.arrayMezzi  = data.reverse();
      this.myForm.controls['mezzo'].patchValue('8058');
      setTimeout(() => {
        console.error('0k')
      }, 500)
    })

    this.dropdownSettings = {
      text: "Seleziona un componente",
      enableSearchFilter: true,
      enableFilterSelectAll: false,
      primaryKey: "id",
      labelKey: "unitcode",
      singleSelection: true,
    }

    this.myForm = this.fb.group({
      mezzo: [],
    });
  }

  filterMezzi($event){
    console.log($event);
  }

  aggModello($event){
    console.log($event);
  }

  onSubmit() {
    console.log(this.myForm.value);
  }

}
