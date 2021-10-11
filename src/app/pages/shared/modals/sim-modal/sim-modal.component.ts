import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { SimService } from 'src/app/API/sim/sim.service';
import { DatePipe } from '@angular/common';
import { SimPipe } from 'src/app/API/PIPES/sim/sim.pipe';

@Component({
  selector: 'app-sim-modal',
  templateUrl: './sim-modal.component.html',
  styleUrls: ['./sim-modal.component.less']
})
export class SimModalComponent implements OnInit {

  myForm: FormGroup;

  loadingData: Boolean;

  constructor(
    private fb: FormBuilder,
    private _ref: NbDialogRef<any>,
    private _apiSim: SimService,
    private _datePipe: DatePipe,
    private _simPipe: SimPipe) { }

  ngOnInit() {
    this.myForm = this.fb.group({
      sim: this.fb.array([]),
    });
  }

  addFormGroup(name: string, form: FormArray){
    this.myForm.setControl(name, form);
  }

  onSubmit(){
    console.log(this.myForm.value);
    this.myForm.value.sim[0].dataAttivazione = this._datePipe.transform(this.myForm.value.sim[0].dataAttivazione, 'yyyy-MM-dd');
    this.myForm.value.sim[0].dataDisattivazione = this._datePipe.transform(this.myForm.value.sim[0].dataDisattivazione, 'yyyy-MM-dd');
    let flags = this._simPipe.transformInserimento(this.myForm.value.sim, false);
    this.loadingData = true;
    this._apiSim.addSim(flags[0]).subscribe(
      resp => {
        this.loadingData = false;
        this._ref.close({"id": resp.id, "serial": this.myForm.value.sim[0].serial});
      },
      error => { alert("Errore") }
    );
  }

  onReset(){
    this.myForm.reset();
  }

}
