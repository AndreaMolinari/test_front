import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModelloService } from 'src/app/API/modello/modello.service';
import { SimService } from 'src/app/API/sim/sim.service';
import { NbDialogService, NbDateService } from '@nebular/theme';
import { ModelloModalComponent } from '../../modals/modello-modal/modello-modal.component';
import { DatePipe } from '@angular/common';
import { SimPipe } from 'src/app/API/PIPES/sim/sim.pipe';
import { BrandService } from 'src/app/API/brand/brand.service';

@Component({
  selector: 'shared-sim-crea',
  templateUrl: './sim-crea.component.html',
  styleUrls: ['./sim-crea.component.less']
})
export class SimCreaComponent implements OnInit, OnDestroy {

  @Output() outForm = new EventEmitter<FormArray>();

  @Input() parentForm: FormArray;

  @Input() max = 99;

  @Input() modifica = false;
  @Input() dataInstance: any;

  questoForm: FormGroup;

  todayDate;

  UNonEdit;

  arrayModello = [];
  arraySIM = [];

  constructor(
    private fb: FormBuilder,
    private apiBrand: BrandService,
    private apiModello: ModelloService,
    private simPipe: SimPipe,
    private dialogService: NbDialogService,
    private datePipe: DatePipe,
    private dateService: NbDateService<Date>) {
    this.todayDate = dateService.today();
    this.questoForm = this.fb.group({});
  }

  ngOnInit() {
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();

    this.parentForm.at(0).get('dataAttivazione').markAsDirty();
    this.parentForm.at(0).get('dataDisattivazione').markAsDirty();

    if (this.modifica === true) {
      this.getModelli();
      this.onEdit(this.dataInstance);
    } else {
      this.getModelli();
    }
  }

  crea(): FormGroup {
    if (this.modifica) {
      return this.fb.group({
        id: [],
        idModello: [''],
        serial: ['', Validators.required],
        apn: [''],
        dataAttivazione: [],
        dataDisattivazione: [],
        bloccato: [false]
      });
    } else {
      return this.fb.group({
        idModello: [''],
        serial: ['', Validators.required],
        apn: [],
        dataAttivazione: [this.todayDate],
        dataDisattivazione: [],
        bloccato: [false]
      });
    }
  }

  getModelli(_callback?) {
    this.apiBrand.filterByTipologia(11).subscribe(resp => {
      this.arrayModello = resp;
      if (_callback) {
        _callback();
      }
    });
  }

  onEdit(data) {
    this.UNonEdit = data.modificaDati.subscribe(data => {
      console.log('MODIFICA/sim', data);
      this.getModelli(() => {
        if ((data.sim !== undefined) && (data.sim.length > 0)) {
          const flags = this.simPipe.transformInserimento(data, true);
          this.parentForm.at(0).get('id').patchValue(data.sim[0].id);
          this.parentForm.at(0).get('idModello').patchValue(data.sim[0].idModello.toString());
          this.parentForm.at(0).get('serial').patchValue(data.sim[0].serial);
          this.parentForm.at(0).get('apn').patchValue(data.sim[0].apn);

          const dataStripped = {
            attivazione: {
              anno: 1970,
              mese: 0,
              giorno: 1
            },
            disattivazione: {
              anno: 1970,
              mese: 0,
              giorno: 1
            }
          };
          dataStripped.attivazione.anno = +(this.datePipe.transform(data.sim[0].dataAttivazione, 'yyyy'));
          dataStripped.attivazione.mese = +(this.datePipe.transform(data.sim[0].dataAttivazione, 'MM')) - 1;
          dataStripped.attivazione.giorno = +(this.datePipe.transform(data.sim[0].dataAttivazione, 'd'));
          dataStripped.disattivazione.anno = +(this.datePipe.transform(data.sim[0].dataDisattivazione, 'yyyy'));
          dataStripped.disattivazione.mese = +(this.datePipe.transform(data.sim[0].dataDisattivazione, 'MM')) - 1;
          dataStripped.disattivazione.giorno = +(this.datePipe.transform(data.sim[0].dataDisattivazione, 'd'));
          const temp_dataAttivazione = this.dateService.createDate(
            dataStripped.attivazione.anno,
            dataStripped.attivazione.mese,
            dataStripped.attivazione.giorno
          );
          const temp_dataDisattivazione = this.dateService.createDate(
            dataStripped.disattivazione.anno,
            dataStripped.disattivazione.mese,
            dataStripped.disattivazione.giorno
          );

          if (data.sim[0].dataAttivazione !== null) {
            this.parentForm.at(0).get('dataAttivazione').patchValue(temp_dataAttivazione);
          }
          if (data.sim[0].dataDisattivazione !== null) {
            this.parentForm.at(0).get('dataDisattivazione').patchValue(temp_dataDisattivazione);
          }
          this.parentForm.at(0).get('bloccato').patchValue(flags.bloccato);
        } else if (data.id !== undefined) {
          const flags = this.simPipe.transformInserimento(data, true);
          this.parentForm.at(0).get('id').patchValue(data.id);
          this.parentForm.at(0).get('idModello').patchValue(data.idModello.toString());
          this.parentForm.at(0).get('serial').patchValue(data.serial);
          this.parentForm.at(0).get('apn').patchValue(data.apn);

          if (data.dataAttivazione !== null) {
            this.parentForm.at(0).get('dataAttivazione').patchValue(data.dataAttivazione);
          }
          if (data.dataDisattivazione !== null) {
            this.parentForm.at(0).get('dataDisattivazione').patchValue(data.dataDisattivazione);
          }
          this.parentForm.at(0).get('bloccato').patchValue(flags[0].bloccato);
        } else {
          console.log('Nessuna SIM collegata!');
        }
      });
    })
  }

  aggModello($event) {
    if ($event === 'addModello') {
      this.dialogService.open(ModelloModalComponent)
        .onClose.subscribe(submitData => {
          console.log('Submit data MODELLO ', submitData);

          this.arrayModello.push(submitData);
          setTimeout(() => {
            this.parentForm.at(0).get('idModello').patchValue(submitData.id);
          });
        });
    }
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      this.outForm.emit(this.parentForm);
    } else {
      alert('Non puoi aggiungere più di ' + this.max + ' dispositivi');
    }
  }

  remove(i) {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
  }

  ngOnDestroy() {
    if (this.UNonEdit) {
      this.UNonEdit.unsubscribe();
    }
  }

}
