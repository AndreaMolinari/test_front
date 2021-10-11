import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TipologiaService } from 'src/app/API/tipologia/tipologia.service';
import { BrandService } from 'src/app/API/brand/brand.service';
import { BrandModalComponent } from '../../modals/brand-modal/brand-modal.component';
import { NbDialogService } from '@nebular/theme';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'shared-modello-crea',
  templateUrl: './modello-crea.component.html',
  styleUrls: ['./modello-crea.component.less']
})

export class ModelloCreaComponent implements OnInit, OnDestroy {
  @Output() outForm = new EventEmitter<FormArray>();
  @Input() parentForm: FormArray;
  @Input() max = 99;
  @Input() modifica = false;
  @Input() dataInstance: any;

  questoForm: FormGroup;

  arrayBrand = [];
  arrayTipologia = [];

  filteredTipologie: Observable<any[]>[] = [];
  filteredBrands: Observable<any[]>[] = [];

  // ? RUNTIME VARIABLES
  apiTipologia1: Subscription;
  apiTipologia2: Subscription;
  apiModifica: Subscription;

  constructor(
    private fb: FormBuilder,
    private apiTipologia: TipologiaService,
    private apiBrand: BrandService,
    private dialogService: NbDialogService
  ) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();
    if (this.modifica === true) {
      this.onEdit(this.dataInstance);
    } else {
      // this.getBrand();
      // this.tipologiaModello();
    }
  }

  crea(): FormGroup {
    if (this.modifica === true) {
      return this.fb.group({
        id: [],
        idBrand: ['', Validators.required],
        autocompleteBrand: [''],
        idTipologia: ['', Validators.required],
        autocompleteTipologia: [''],
        modello: ['', Validators.required]
      });
    } else {
      return this.fb.group({
        idBrand: ['', Validators.required],
        autocompleteBrand: [''],
        idTipologia: ['', Validators.required],
        autocompleteTipologia: [''],
        modello: ['', Validators.required]
      });
    }
  }

  pushNewTIPOLOGIAObservable(formArrayIndex: number): void {
    this.filteredTipologie[formArrayIndex] = combineLatest([
      combineLatest([
        this.apiTipologia.filterByID(64),
        this.apiTipologia.filterByID(65)
      ])
        .pipe(
          map(([tipologia64, tipologia65]: [any, any]) => {
            const arrayTipologie = tipologia64.all_children.concat(tipologia65.all_children);
            arrayTipologie.sort((b, a) => {
              const textA = a.tipologia.toUpperCase();
              const textB = b.tipologia.toUpperCase();
              return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
            });
            return arrayTipologie;
          })
        ),
      this.parentForm.at(formArrayIndex).get('autocompleteTipologia').valueChanges.pipe(startWith('')),
      this.parentForm.at(formArrayIndex).get('idTipologia').valueChanges.pipe(startWith(this.parentForm.at(formArrayIndex).get('idTipologia').value))
    ]).pipe(
      map(([apiResult, search, selectedValue]: [any[], string, number]) => {
        let results = apiResult;
        if (search) {
          results = apiResult.filter(option => option.tipologia.trim().toLowerCase().includes(search.trim().toLowerCase()));
        }
        if (selectedValue) {
          const index = results.findIndex(element => element.id === this.parentForm.at(formArrayIndex).get('idTipologia').value);
          if (index !== -1) {
            results.unshift(results.splice(index, 1)[0]);
          }
        }
        return results;
      })
    );
  }

  pushNewBRANDObservable(formArrayIndex: number): void {
    this.filteredBrands[formArrayIndex] = combineLatest([
      this.apiBrand.getAll().pipe(
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

  // getBrand(_callback?): void {
  //   this.apiBrand.getAll().subscribe(data => {
  //     this.arrayBrand = data;
  //     this.arrayBrand.sort((a, b) => {
  //       const textA = a.marca.toUpperCase();
  //       const textB = b.marca.toUpperCase();
  //       return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
  //     });
  //     if (_callback) { _callback(); }
  //   });
  // }

  // tipologiaModello(_callback?): void {
  //   this.apiTipologia1 = this.apiTipologia.filterByID(64).subscribe(data => {
  //     this.arrayTipologia = data.all_children;
  //   });
  //   this.apiTipologia2 = this.apiTipologia.filterByID(65).subscribe(data => {
  //     data.all_children.forEach(tipologia => {
  //       this.arrayTipologia.push(tipologia);
  //     });
  //     if (_callback) { _callback(); }
  //   });
  // }

  onEdit(data): void {
    this.apiModifica = data.modificaDati.subscribe(resp => {

      if ((resp.modello) && ((Array.isArray(resp.modello)) && (resp.modello.length > 0))) {
        this.parentForm.at(0).get('id').patchValue(resp.modello[0].id);
        this.parentForm.at(0).get('idBrand').patchValue(resp.modello[0].idBrand);
        this.parentForm.at(0).get('idTipologia').patchValue(resp.modello[0].idTipologia);
        this.parentForm.at(0).get('modello').patchValue(resp.modello[0].modello);

        this.pushNewTIPOLOGIAObservable(0);
        this.pushNewBRANDObservable(0);
      } else if (resp) {
        this.parentForm.at(0).get('id').patchValue(resp.id);
        this.parentForm.at(0).get('idBrand').patchValue(resp.idBrand);
        this.parentForm.at(0).get('idTipologia').patchValue(resp.idTipologia);
        this.parentForm.at(0).get('modello').patchValue(resp.modello);

        this.pushNewTIPOLOGIAObservable(0);
        this.pushNewBRANDObservable(0);
      }

    });
  }

  aggBrand($event): void {
    if ($event === 'addBrand') {
      this.dialogService.open(BrandModalComponent)
        .onClose.subscribe(submitData => {
          if (submitData) {
            this.pushNewBRANDObservable(0);
            this.parentForm.at(0).get('idBrand').setValue(submitData.id);
            // this.filteredBrands.forEach((observable: Observable<any[]>) => observable.pipe(map(brand => console.warn(brand))));
          } else {
            this.parentForm.at(0).get('idBrand').setValue(null);
          }
        });
    }
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      if (!this.modifica) {
        this.pushNewTIPOLOGIAObservable(this.parentForm.length - 1);
        this.pushNewBRANDObservable(this.parentForm.length - 1);
      }
      this.outForm.emit(this.parentForm);
    } else {
      alert('Non puoi aggiungere più di ' + this.max + ' modelli');
    }
  }

  remove(i: number): void {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
  }

  ngOnDestroy(): void {
    if (this.apiTipologia1) {
      this.apiTipologia1.unsubscribe();
    }
    if (this.apiTipologia2) {
      this.apiTipologia2.unsubscribe();
    }
    if (this.apiModifica) {
      this.apiModifica.unsubscribe();
    }
  }

}
