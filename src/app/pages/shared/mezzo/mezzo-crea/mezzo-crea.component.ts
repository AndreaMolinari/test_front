import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { ModelloModalComponent } from 'src/app/pages/shared/modals/modello-modal/modello-modal.component';
import { BrandService } from 'src/app/API/brand/brand.service';
import { BrandModalComponent } from '../../modals/brand-modal/brand-modal.component';
import { env } from 'process';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'shared-mezzo-crea',
  templateUrl: './mezzo-crea.component.html',
  styleUrls: ['./mezzo-crea.component.less']
})

export class MezzoCreaComponent implements OnInit, OnDestroy {
  @Output() outForm = new EventEmitter<FormArray>();
  @Input() parentForm: FormArray;
  @Input() max = 99;
  @Input() modifica = false;
  @Input() dataInstance: any;

  cardAccent = 'success';

  questoForm: FormGroup;

  // arrayBrand: any[] = [];
  // arrayBrandFiltered: Observable<any[]> = new Observable<any[]>();
  // arrayModello: any[] = [];
  // arrayModelloFiltered: Observable<any[]> = new Observable<any[]>();

  filteredBrands: Observable<any[]>[] = [];
  filteredModels: Observable<any[]>[] = [];

  // ? RUNTIME VARIABLES
  UNonModifica: Subscription;

  constructor(
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private apiBrand: BrandService
  ) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit() {
    this.questoForm.setControl('parentForm', this.parentForm);
    // this.getBrand();
    setTimeout(() => {
      this.add();
      if (this.modifica === true) {
        // this.getModelli();
        this.onEdit(this.dataInstance);
      }
    });
  }

  crea(): FormGroup {
    if (this.modifica === true) {
      return this.fb.group({
        id: [],
        idBrand: [Validators.required],
        idModello: [Validators.required],
        targa: [, Validators.required],
        telaio: [],
        anno: [],
        colore: [],
        info: [],
        autocompleteBrand: [''],
        autocompleteModello: ['']
      });
    }
    return this.fb.group({
      idBrand: ['', Validators.required],
      idModello: ['', Validators.required],
      targa: ['', Validators.required],
      telaio: [''],
      anno: [''],
      colore: [''],
      info: [''],
      autocompleteBrand: [''],
      autocompleteModello: ['']
    });
  }

  pushNewBRANDObservable(formArrayIndex: number): void {
    this.filteredBrands[formArrayIndex] = combineLatest([
      this.apiBrand.filterByTipologia(64).pipe(
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

  isRequired($event, origin): void {
    if (origin === 'targa') {
      if ($event.target.value.length === 0) {
        this.parentForm.at(0).get('targa').clearValidators();
        this.parentForm.at(0).get('targa').updateValueAndValidity();
        this.parentForm.at(0).get('telaio').setValidators(Validators.required);
        this.parentForm.at(0).get('telaio').updateValueAndValidity();
      } else {
        this.parentForm.at(0).get('targa').setValidators(Validators.required);
        this.parentForm.at(0).get('targa').updateValueAndValidity();
        this.parentForm.at(0).get('telaio').clearValidators();
        this.parentForm.at(0).get('telaio').updateValueAndValidity();
      }
    }
    if (origin === 'telaio') {
      if ($event.target.value.length === 0) {
        this.parentForm.at(0).get('telaio').clearValidators();
        this.parentForm.at(0).get('telaio').updateValueAndValidity();
        this.parentForm.at(0).get('targa').setValidators(Validators.required);
        this.parentForm.at(0).get('targa').updateValueAndValidity();
      } else {
        this.parentForm.at(0).get('telaio').setValidators(Validators.required);
        this.parentForm.at(0).get('telaio').updateValueAndValidity();
        this.parentForm.at(0).get('targa').clearValidators();
        this.parentForm.at(0).get('targa').updateValueAndValidity();
      }
    }
  }

  // private _filterBrand(value: string): string[] {
  //   const filterValue = value.trim().toLowerCase();
  //   return this.arrayBrand.filter(option => option.marca.toLowerCase().includes(filterValue));
  // }

  // private _filterModello(value: string): string[] {
  //   const filterValue = value.trim().toLowerCase();
  //   return this.arrayModello.filter(option => option.modello.toLowerCase().includes(filterValue));
  // }

  // getBrand(): void {
  //   this.apiBrand.filterByTipologia(64).subscribe(resp => {
  //     this.arrayBrand = resp;
  //     this.customSearchBrand();
  //     this.arrayBrand.sort((a, b) => {
  //       const textA = a.marca.toUpperCase();
  //       const textB = b.marca.toUpperCase();
  //       return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  //     });
  //     this.getModelli();
  //   });
  // }

  // getModelli(idBrand?): void {
  //   if (idBrand === undefined && isNaN(idBrand)) {

  //     this.arrayModello = [];
  //     this.arrayBrand.forEach(brand => {
  //       if (brand.modelli !== null) {
  //         brand.modelli.forEach(modello => {
  //           this.arrayModello.push(modello);
  //         });
  //       }
  //     });
  //     this.arrayModello.sort((a, b) => {
  //       const textA = a.modello.toUpperCase();
  //       const textB = b.modello.toUpperCase();
  //       return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  //     });
  //     this.customSearchModello();
  //   } else {
  //     this.arrayModello = this.arrayBrand.filter(val => val.id === idBrand)[0].modelli;
  //     this.arrayModello.sort((a, b) => {
  //       const textA = a.modello.toUpperCase();
  //       const textB = b.modello.toUpperCase();
  //       return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  //     });
  //     this.customSearchModello();
  //   }
  // }

  // customSearchBrand(i?: number): void {
  //   if (typeof (i) === 'number') {
  //     this.arrayBrandFiltered = new Observable<string[]>(observer => {
  //       observer.next(this._filterBrand(this.parentForm.at(i).get('autocompleteBrand').value));
  //     });
  //   } else {
  //     if (env.debug) { console.log('Refresh lista componenti...'); }
  //     this.parentForm.controls.forEach(formControl => {
  //       this.arrayBrandFiltered = new Observable<string[]>(observer => {
  //         observer.next(this._filterBrand(formControl.get('autocompleteBrand').value));
  //       });
  //     });
  //   }
  // }

  // customSearchModello(i?: number): void {
  //   if (typeof (i) === 'number') {
  //     this.arrayModelloFiltered = new Observable<string[]>(observer => {
  //       observer.next(this._filterModello(this.parentForm.at(i).get('autocompleteModello').value));
  //     });
  //   } else {
  //     if (env.debug) { console.log('Refresh lista componenti...'); }
  //     this.parentForm.controls.forEach(formControl => {
  //       this.arrayModelloFiltered = new Observable<string[]>(observer => {
  //         observer.next(this._filterModello(formControl.get('autocompleteModello').value));
  //       });
  //     });
  //   }
  // }

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
    } else if ($event === 'addBrand') {
      this.dialogService.open(BrandModalComponent)
        .onClose.subscribe(submitData => {
          if (submitData) {
            this.pushNewBRANDObservable(0);
            this.parentForm.at(0).get('idBrand').patchValue(submitData.id);
          } else {
            this.parentForm.at(0).get('idBrand').patchValue(null);
          }
        })
    }
  }

  onEdit(data): void {
    this.cardAccent = 'warning';
    this.UNonModifica = data.modificaDati.subscribe(resp => {
      if (resp) {
        this.parentForm.at(0).get('id').patchValue(resp.id);
        this.parentForm.at(0).get('idBrand').patchValue(resp.modello.idBrand);
        this.parentForm.at(0).get('idModello').patchValue(resp.modello.id);
        this.parentForm.at(0).get('targa').patchValue(resp.targa);
        this.parentForm.at(0).get('telaio').patchValue(resp.telaio);
        this.parentForm.at(0).get('colore').patchValue(resp.colore);
        this.parentForm.at(0).get('info').patchValue(resp.info);
        this.parentForm.at(0).get('anno').patchValue(resp.anno);

        this.pushNewBRANDObservable(0);
        this.pushNewMODELLOObservable(0);
      } else {
        console.warn('Nessun mezzo collegato...');
      }
    });
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      if (!this.modifica) {
        this.pushNewBRANDObservable(this.parentForm.length - 1);
        this.pushNewMODELLOObservable(this.parentForm.length - 1);
      }
      this.outForm.emit(this.parentForm);
    } else {
      alert('Non puoi aggiungere più di ' + this.max + ' mezzi');
    }
  }

  remove(i: number): void {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
  }

  ngOnDestroy(): void {
    if (this.UNonModifica) {
      this.UNonModifica.unsubscribe();
    }
  }

}
