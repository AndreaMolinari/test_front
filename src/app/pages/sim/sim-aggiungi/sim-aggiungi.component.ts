import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Location, DatePipe } from '@angular/common';
import { SimService } from 'src/app/API/sim/sim.service';
import { SimPipe } from 'src/app/API/PIPES/sim/sim.pipe';

@Component({
  selector: 'app-sim-aggiungi',
  templateUrl: './sim-aggiungi.component.html',
  styleUrls: ['./sim-aggiungi.component.less']
})
export class SimAggiungiComponent implements OnInit {

  myForm: FormGroup;

  modifica: boolean;

  constructor(
    private fb: FormBuilder,
    public apiSIM: SimService,
    private simPipe: SimPipe,
    private activatedRoute: ActivatedRoute,
    private toastrService: NbToastrService,
    private router: Router,
    private location: Location,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      sim: this.fb.array([]),
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
      this.apiSIM.filterByID(urlID);
    }
  }

  onSubmit() {
    console.log(this.myForm);
    this.myForm.value.sim[0].dataAttivazione = this.datePipe.transform(this.myForm.value.sim[0].dataAttivazione, 'yyyy-MM-dd');
    this.myForm.value.sim[0].dataDisattivazione = this.datePipe.transform(this.myForm.value.sim[0].dataDisattivazione, 'yyyy-MM-dd');
    const flags = this.simPipe.transformInserimento(this.myForm.value.sim, false);
    if (this.modifica === true) {
      this.apiSIM.putSim(flags[0]).subscribe(
        resp => {
          this.toastrService.success('ID SIM: ' + resp, 'SIM modificato correttamente!');
          this.router.navigate(['/pages/sim/lista']);
        }, error => {
          this.toastrService.danger(error, 'SIM NON modificato!');
          console.error(error);
        });
    } else {
      this.apiSIM.addSim(flags[0]).subscribe(
        resp => {
          this.toastrService.success('ID SIM: ' + resp, 'SIM aggiunto correttamente!');
          this.router.navigate(['/pages/sim/lista']);
        }, error => {
          this.toastrService.danger(error, 'SIM NON aggiunto!');
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
