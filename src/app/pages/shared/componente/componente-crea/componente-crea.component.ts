import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ModelloModalComponent } from '../../modals/modello-modal/modello-modal.component';
import { NbDialogService } from '@nebular/theme';
import { SimService } from 'src/app/API/sim/sim.service';
import { BrandModalComponent } from '../../modals/brand-modal/brand-modal.component';
import { SimModalComponent } from '../../modals/sim-modal/sim-modal.component';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { BrandService } from 'src/app/API/brand/brand.service';
import { debounceTime, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'shared-componente-crea',
  templateUrl: './componente-crea.component.html',
  styleUrls: ['./componente-crea.component.less']
})

export class ComponenteCreaComponent implements OnInit, OnDestroy {
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

  loadingData: boolean;

  filteredBrands: Observable<any[]>[] = [];
  filteredModels: Observable<any[]>[] = [];
  filteredSIMs: Observable<any[]>[] = [];

  // ? RUNTIME VARIABLES
  UNonEdit: Subscription;

  constructor(
    private fb: FormBuilder,
    private apiBrand: BrandService,
    private apiSIM: SimService,
    private dialogService: NbDialogService,
    private activatedRoute: ActivatedRoute
  ) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.questoForm.setControl('parentForm', this.parentForm);
    if (this.modifica) {
      this.onEdit(this.dataInstance);
    } else {
      this.add();

      this.parentForm.at(0).get('unitcode').valueChanges.pipe(
        debounceTime(250)
      ).subscribe((changes: string) => this.autoCompleteInfos(changes));

    }
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

  pushNewBRANDObservable(formArrayIndex: number): void {
    this.filteredBrands[formArrayIndex] = combineLatest([
      this.apiBrand.filterByTipologia(10).pipe(
        map(resp => resp.sort((b, a) => {
          const textA = a.marca.toUpperCase();
          const textB = b.marca.toUpperCase();
          return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
        }))
      ),
      this.parentForm.at(formArrayIndex).get('autocompleteBrand').valueChanges.pipe(startWith('')),
      this.parentForm.at(formArrayIndex).get('idBrand').valueChanges.pipe(startWith(this.parentForm.at(formArrayIndex).get('idBrand').value))
    ]).pipe(
      map(([apiResult, search, selectedValue]: [any[], string, number]) => {
        let results = apiResult;
        if (search) {
          results = apiResult.filter(option => option.marca.trim().toLowerCase().includes(search.trim().toLowerCase()));
        }
        if (selectedValue) {
          const index = results.findIndex(element => element.id === this.parentForm.at(formArrayIndex).get('idBrand').value);
          if (index !== -1) {
            results.unshift(results.splice(index, 1)[0]);
          }
        }
        return results;
      })
    );
  }

  pushNewMODELLOObservable(formArrayIndex: number): void {
    this.filteredModels[formArrayIndex] = combineLatest([
      this.filteredBrands[formArrayIndex].pipe(
        map((resp: any[]) => {
          resp = resp.flatMap(val => val.modelli);
          resp.sort((b, a) => {
            const textA = a.modello.toUpperCase();
            const textB = b.modello.toUpperCase();
            return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
          });
          return resp;
        })
      ),
      this.parentForm.at(formArrayIndex).get('autocompleteModello').valueChanges.pipe(startWith('')),
      this.parentForm.at(formArrayIndex).get('idModello').valueChanges.pipe(startWith(this.parentForm.at(formArrayIndex).get('idModello').value)),
      this.parentForm.at(formArrayIndex).get('idBrand').valueChanges.pipe(startWith(this.parentForm.at(formArrayIndex).get('idBrand').value))
    ]).pipe(
      map(([apiResult, search, selectedValue, idBrandSelected]: [any[], string, number, number]) => {
        let results = apiResult;
        results = results.filter(val => val.idBrand === idBrandSelected);
        apiResult = apiResult.filter(val => val.idBrand === idBrandSelected);
        if (search) {
          results = apiResult.filter(option => option.modello.trim().toLowerCase().includes(search.trim().toLowerCase()));
        }
        if (selectedValue) {
          const index = results.findIndex(element => element.id === this.parentForm.at(formArrayIndex).get('idModello').value);
          if (index !== -1) {
            results.unshift(results.splice(index, 1)[0]);
          }
        }
        return results;
      })
    );
  }

  pushNewSIMObservable(formArrayIndex: number): void {
    const apiCall = (this.activatedRoute.snapshot.paramMap.get('id'))
      ? this.apiSIM.getNonAssociatiComponente(this.activatedRoute.snapshot.paramMap.get('id')) : this.apiSIM.getAllNonAssociati();

    this.filteredSIMs[formArrayIndex] = combineLatest([
      apiCall.pipe(
        map((resp: any[]) => {
          resp.sort((b, a) => {
            const textA = a.serial.toUpperCase();
            const textB = b.serial.toUpperCase();
            return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
          });
          return resp;
        })
      ),
      this.parentForm.at(formArrayIndex).get('autocompleteSim').valueChanges.pipe(startWith('')),
      this.parentForm.at(formArrayIndex).get('idSim').valueChanges.pipe(startWith(this.parentForm.at(formArrayIndex).get('idSim').value))
    ]).pipe(
      map(([apiResult, search, selectedValue]: [any[], string, number]) => {
        let results = apiResult;

        if (search) {
          results = apiResult.filter(option => option.serial.trim().toLowerCase().includes(search.trim().toLowerCase()));
        }
        if (selectedValue) {
          const index = results.findIndex(element => element.id === this.parentForm.at(formArrayIndex).get('idSim').value);
          if (index !== -1) {
            results.unshift(results.splice(index, 1)[0]);
          }
        }
        return results;
      })
    );
  }

  onEdit(serviceInstance): void {
    this.loadingData = true;
    this.UNonEdit = serviceInstance.modificaDati.subscribe(resp => {
      if (resp.componente && Array.isArray(resp.componente)) {
        resp.componente.forEach((element, i: number) => {
          this.add();
          this.parentForm.at(i).get('id').patchValue(element.id);
          this.parentForm.at(i).get('idBrand').patchValue(element.modello.idBrand);
          this.parentForm.at(i).get('idModello').patchValue(element.idModello);
          this.parentForm.at(i).get('unitcode').patchValue(element.unitcode);
          this.parentForm.at(i).get('idSim').patchValue((element.sim !== null) ? element.sim.id : null);

          this.pushNewBRANDObservable(i);
          this.pushNewMODELLOObservable(i);
          this.pushNewSIMObservable(i);
        });
        this.loadingData = false;
      } else {
        this.add();
        this.parentForm.at(0).get('id').patchValue(resp.id);
        this.parentForm.at(0).get('idBrand').patchValue(resp.modello.idBrand);
        this.parentForm.at(0).get('idModello').patchValue(resp.idModello);
        this.parentForm.at(0).get('unitcode').patchValue(resp.unitcode);
        this.parentForm.at(0).get('idSim').patchValue((resp.sim !== null) ? resp.sim.id : null);

        this.pushNewBRANDObservable(0);
        this.pushNewMODELLOObservable(0);
        this.pushNewSIMObservable(0);

        this.loadingData = false;
      }
    });
  }

  autoCompleteInfos(unitcode: string): void {
    switch (unitcode.substring(0, 6)) {
      case '202911': case '206411':
        this.parentForm.at(0).get('idBrand').patchValue(4);
        this.parentForm.at(0).get('idModello').patchValue(8);
        break;

      case '206419':
        this.parentForm.at(0).get('idBrand').patchValue(4);
        this.parentForm.at(0).get('idModello').patchValue(7);
        break;

      case '202918': case '206418':
        this.parentForm.at(0).get('idBrand').patchValue(4);
        this.parentForm.at(0).get('idModello').patchValue(40);
        break;

      case '302914': case '306414':
        this.parentForm.at(0).get('idBrand').patchValue(4);
        this.parentForm.at(0).get('idModello').patchValue(4);
        break;
    }
  }

  modalAdd($event: string): void {
    if ($event === 'addModello') {
      this.dialogService.open(ModelloModalComponent)
        .onClose.subscribe(submitData => {
          if (submitData) {
            this.pushNewMODELLOObservable(0);
            this.parentForm.at(0).get('idModello').patchValue(submitData.id);
          } else {
            this.parentForm.at(0).get('idModello').patchValue(null);
          }
        });
    } else if ($event === 'addSIM') {
      this.dialogService.open(SimModalComponent)
        .onClose.subscribe(submitData => {
          if (submitData) {
            this.pushNewSIMObservable(0);
            this.parentForm.at(0).get('idSim').patchValue(submitData.id);
          } else {
            this.parentForm.at(0).get('idSim').patchValue(null);
          }
        });
    } else if ($event === 'addBrand') {
      this.dialogService.open(BrandModalComponent)
        .onClose.subscribe(submitData => {
          if (submitData) {
            this.pushNewBRANDObservable(0);
            this.parentForm.at(0).get('idBrand').patchValue(submitData.id);
          } else {
            this.parentForm.at(0).get('idBrand').patchValue(null);
          }
        });
    }
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      if (!this.modifica) {
        this.pushNewBRANDObservable(this.parentForm.length - 1);
        this.pushNewMODELLOObservable(this.parentForm.length - 1);
        this.pushNewSIMObservable(this.parentForm.length - 1);
      }
      this.outForm.emit(this.parentForm);
    } else {
      alert('Non puoi aggiungere più di ' + this.max + ' dispositivi');
    }
  }

  remove(i: number): void {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
  }

  ngOnDestroy(): void {
    if (this.UNonEdit) {
      this.UNonEdit.unsubscribe();
    }
  }

}
