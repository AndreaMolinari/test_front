import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { ServizioService } from 'src/app/API/servizio/servizio.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-servizio-aggiungi-modal',
  templateUrl: './servizio-aggiungi-modal.component.html',
  styleUrls: ['./servizio-aggiungi-modal.component.less']
})
export class ServizioAggiungiModalComponent implements OnInit {

  myForm: FormGroup;
  modifica: boolean;
  urlIDanagrafica;

  loadingData = false;

  constructor(
    private fb: FormBuilder,
    public apiServizio: ServizioService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      servizio: this.fb.array([])
    })
    this.onEdit();
    this.urlIDanagrafica = this.activatedRoute.snapshot.paramMap.get('idAnagrafica');
  }

  addFormGroup(name: string, form: FormArray) {
    this.myForm.setControl(name, form);
  }

  onEdit() {
    // let urlID = this.activatedRoute.snapshot.paramMap.get('id');
    const urlID = 9583;
    if (urlID !== null) {
      this.modifica = true;
      this.apiServizio.filterByID(urlID);
    }
  }

  onSubmit(myForm) {
    console.log(myForm);
  }

}
