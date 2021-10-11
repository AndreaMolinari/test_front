import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Observable } from 'rxjs';
import { BrandService } from 'src/app/API/brand/brand.service';
import { ModelloService } from 'src/app/API/modello/modello.service';
import { SimService } from 'src/app/API/sim/sim.service';
import { isArray } from 'util';
import { BrandModalComponent } from '../../modals/brand-modal/brand-modal.component';
import { ModelloModalComponent } from '../../modals/modello-modal/modello-modal.component';
import { SimModalComponent } from '../../modals/sim-modal/sim-modal.component';

@Component({
  selector: 'shared-tacho-crea',
  templateUrl: './tacho-crea.component.html',
  styleUrls: ['./tacho-crea.component.less']
})
export class TachoCreaComponent implements OnInit, OnDestroy {

  @Output() outForm = new EventEmitter<FormArray>();

  @Input() parentForm: FormArray;

  @Input() max = 99;

  @Input() modifica: boolean;
  @Input() dataInstance: any;

  questoForm: FormGroup;

  arrayBrand = [];
  arrayBrandFiltered: Observable<any> = new Observable<any>();
  arrayModello = [];
  arrayModelloFiltered: Observable<any> = new Observable<any>();
  arraySIM = [];
  arraySIMFiltered: Observable<any> = new Observable<any>();

  UNonEdit;

  loadingData: boolean;

  constructor(
    private fb: FormBuilder,
    private apiModello: ModelloService,
    private apiBrand: BrandService,
    private apiSIM: SimService,
    private dialogService: NbDialogService,
    private activatedRoute: ActivatedRoute) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit() {
    this.questoForm.setControl('parentForm', this.parentForm);
    setTimeout(() => {
      if (this.modifica) {
        this.onEdit(this.dataInstance);
        this.getBrand();
        this.getModelli();
        this.getSIM();
      } else {
        this.add();
        this.getBrand();
        this.getModelli();
        this.getSIM();
      }
    });
  }

  crea(): FormGroup {
    if (this.modifica) {
      return this.fb.group({
        id: [null],
        idBrand: [null],
        idModello: [null, Validators.required],
        idSim: [null],
        unitcode: ['', Validators.required],
        autocompleteBrand: [''],
        autocompleteModello: [''],
        autocompleteSim: ['']
      });
    } else {
      return this.fb.group({
        idBrand: [null, Validators.required],
        idModello: [null, Validators.required],
        idSim: [null],
        unitcode: ['', Validators.required],
        autocompleteBrand: [''],
        autocompleteModello: [''],
        autocompleteSim: ['']
      });
    }
  }

  private _filterBrand(value: string): string[] {
    const filterValue = value.trim().toLowerCase();
    return this.arrayBrand.filter(option => option.marca.toLowerCase().includes(filterValue));
  }

  private _filterModello(value: string): string[] {
    const filterValue = value.trim().toLowerCase();
    return this.arrayModello.filter(option => option.modello.toLowerCase().includes(filterValue));
  }

  private _filterSim(value: string): string[] {
    const filterValue = value.trim().toLowerCase();
    return this.arraySIM.filter(option => option.serial.toLowerCase().includes(filterValue));
  }

  getBrand(_callback?) {
    this.apiBrand.filterByTipologia(92).subscribe(data => {
      this.arrayBrand = data;
      this.arrayBrand.sort((a, b) => {
        const textA = a.marca.toUpperCase();
        const textB = b.marca.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.customSearchBrand();
      if (_callback) {
        _callback();
      }
    });
  }

  getModelli(idBrand?, _callback?) {
    if (idBrand === undefined && isNaN(idBrand)) {

      this.apiBrand.filterByTipologia(92).subscribe(resp => {
        this.arrayModello = [];
        resp.forEach(brand => {
          brand.modelli.forEach(modello => {
            this.arrayModello.push(modello);
          });
        });
        this.arrayModello.sort((a, b) => {
          const textA = a.modello.toUpperCase();
          const textB = b.modello.toUpperCase();
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        });
        this.customSearchModello();
      });
    } else {

      this.arrayModello = this.arrayBrand.filter(val => val.id === idBrand)[0].modelli;
      this.arrayModello.sort((a, b) => {
        const textA = a.modello.toUpperCase();
        const textB = b.modello.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.customSearchModello();
    }
  }

  getSIM(_callback?) {
    const idComponente = this.activatedRoute.snapshot.paramMap.get('id');
    if (idComponente) {
      this.apiSIM.getNonAssociatiComponente(idComponente).subscribe(data => {
        this.arraySIM = data;
        this.customSearchSim();
        if (_callback) {
          _callback();
        }
      })
    } else {
      this.apiSIM.getAllNonAssociati().subscribe(data => {
        this.arraySIM = data;
        this.customSearchSim();
      })
    }
  }

  customSearchBrand(i?: number): void {
    if (typeof (i) === 'number') {
      this.arrayBrandFiltered = new Observable<string[]>(observer => {
        observer.next(this._filterBrand(this.parentForm.at(i).get('autocompleteBrand').value));
      });
    } else {
      this.parentForm.controls.forEach(formControl => {
        this.arrayBrandFiltered = new Observable<string[]>(observer => {
          observer.next(this._filterBrand(formControl.get('autocompleteBrand').value));
        });
      });
    }
  }

  customSearchModello(i?: number): void {
    if (typeof (i) === 'number') {
      this.arrayModelloFiltered = new Observable<string[]>(observer => {
        observer.next(this._filterModello(this.parentForm.at(i).get('autocompleteModello').value));
      });
    } else {
      this.parentForm.controls.forEach(formControl => {
        this.arrayModelloFiltered = new Observable<string[]>(observer => {
          observer.next(this._filterModello(formControl.get('autocompleteModello').value));
        });
      });
    }
  }

  customSearchSim(i?: number): void {
    if (typeof (i) === 'number') {
      this.arraySIMFiltered = new Observable<string[]>(observer => {
        observer.next(this._filterSim(this.parentForm.at(i).get('autocompleteSim').value));
      });
    } else {
      this.parentForm.controls.forEach(formControl => {
        this.arraySIMFiltered = new Observable<string[]>(observer => {
          observer.next(this._filterSim(formControl.get('autocompleteSim').value));
        });
      });
    }
  }

  onEdit(serviceInstance) {
    this.loadingData = true;
    this.UNonEdit = serviceInstance.modificaDati.subscribe(data => {
      console.log('MODIFICA/componente', data);

      if (data.componente !== undefined && isArray(data.componente)) {
        data.componente.forEach((element, i) => {
          this.add();
          this.parentForm.at(i).get('id').patchValue(element.id);
          this.parentForm.at(i).get('idBrand').patchValue(element.modello.idBrand);
          this.parentForm.at(i).get('idModello').patchValue(element.idModello);
          this.parentForm.at(i).get('unitcode').patchValue(element.unitcode);
          this.parentForm.at(i).get('idSim').patchValue((element.sim !== null) ? element.sim.id : null);
        });
        this.loadingData = false;
      } else {
        this.add();
        this.parentForm.at(0).get('id').patchValue(data.id);
        this.parentForm.at(0).get('idBrand').patchValue(data.modello.idBrand);
        this.parentForm.at(0).get('idModello').patchValue(data.idModello);
        this.parentForm.at(0).get('unitcode').patchValue(data.unitcode);
        this.parentForm.at(0).get('idSim').patchValue((data.sim !== null) ? data.sim.id : null);
        this.loadingData = false;
      }
    });
  }

  modalAdd($event) {
    if ($event === 'addModello') {
      this.dialogService.open(ModelloModalComponent)
        .onClose.subscribe(submitData => {
          if (submitData !== undefined) {
            console.log('Submit data MODELLO ', submitData);

            this.arrayModello.push(submitData);
            this.customSearchModello();
            this.parentForm.at(0).get('idModello').patchValue(submitData.id);
          } else {
            this.parentForm.at(0).get('idModello').patchValue(null);
          }
        });
    } else if ($event === 'addSIM') {
      this.dialogService.open(SimModalComponent)
        .onClose.subscribe(submitData => {
          if (submitData !== undefined) {
            console.log('Submit data SIM ', submitData);

            this.arraySIM.unshift(submitData);
            this.parentForm.at(0).get('idSim').patchValue(submitData.id);
            this.customSearchSim();
          } else {
            this.parentForm.at(0).get('idSim').patchValue(null);
          }
        });
    } else if ($event === 'addBrand') {
      this.dialogService.open(BrandModalComponent)
        .onClose.subscribe(submitData => {
          if (submitData !== undefined) {
            console.log('Submit data BRAND ', submitData);

            this.arrayModello.push(submitData);
            this.customSearchBrand();
            this.parentForm.at(0).get('idBrand').patchValue(submitData.id);
          } else {
            this.parentForm.at(0).get('idBrand').patchValue(null);
          }
        })
    }
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      this.outForm.emit(this.parentForm);
    } else {
      alert('Non puoi aggiungere più di ' + this.max + ' dispositivi')
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
