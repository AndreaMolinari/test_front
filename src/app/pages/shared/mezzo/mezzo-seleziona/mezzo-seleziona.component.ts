import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MezzoService } from 'src/app/API/mezzo/mezzo.service';
import { NbDialogService } from '@nebular/theme';
import { MezzoModalComponent } from '../../modals/mezzo-modal/mezzo-modal.component';
import { MezzoPipe } from 'src/app/API/PIPES/mezzo/mezzo.pipe';
import * as env from 'src/environments/env';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'shared-mezzo-seleziona',
  templateUrl: './mezzo-seleziona.component.html',
  styleUrls: ['./mezzo-seleziona.component.less']
})

export class MezzoSelezionaComponent implements OnInit, OnDestroy {
  env = environment;
  isRivenditore = env.rivenditore;

  @Output() outForm = new EventEmitter<FormArray>();
  @Input() parentForm: FormArray;
  @Input() max = 99;
  @Input() modifica: boolean;
  @Input() dataInstance: any;
  @Input() duplicato: boolean;

  questoForm: FormGroup;

  arrayMezzi: any[] = [];
  arrayMezziFiltered: Observable<string[]> = new Observable<string[]>();

  filteredVehicles: Observable<any[]> = new Observable<any[]>();

  // ? RUNTIME VARIABLES
  UNonEdit: Subscription;

  constructor(
    private fb: FormBuilder,
    private apiMezzo: MezzoService,
    private dialogService: NbDialogService,
    private pipeMezzo: MezzoPipe,
    private activatedRoute: ActivatedRoute
  ) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit() {
    this.questoForm.setControl('parentForm', this.parentForm);
    if (this.modifica) {
      this.onEdit(this.dataInstance);
    } else if (this.duplicato) {
      this.add();
      this.onEdit(this.dataInstance);
    } else {
      this.add();
    }
  }

  crea(): FormGroup {
    if (this.modifica === true) {
      return this.fb.group({
        idMezzo: [],
        autocomplete: ['']
      });
    }
    return this.fb.group({
      idMezzo: [],
      autocomplete: ['']
    });
  }

  isTouched(i: number): void {
    this.parentForm.at(i).get('idMezzo').setValidators(Validators.required);
    this.parentForm.at(i).get('idMezzo').updateValueAndValidity();
  }

  isUnTouched(i: number): void {
    this.parentForm.at(i).get('idMezzo').clearValidators();
    this.parentForm.at(i).get('idMezzo').updateValueAndValidity();
  }

  getVehicleANDEnableSearch(): void {
    const apiCALL = (this.activatedRoute.snapshot.paramMap.get('id'))
      ? this.apiMezzo.getNonAssociati(this.activatedRoute.snapshot.paramMap.get('id'))
      : this.apiMezzo.getAllNonAssociati();

    this.filteredVehicles = combineLatest([
      apiCALL.pipe(
        map(resp => {
          resp = this.pipeMezzo.transformMezzoSelect(resp);
          resp.sort((b, a) => {
            const textA = a.identificativo.toUpperCase();
            const textB = b.identificativo.toUpperCase();
            return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
          });
          return resp;
        })
      ),
      this.parentForm.at(0).get('autocomplete').valueChanges.pipe(startWith('')),
      this.parentForm.at(0).get('idMezzo').valueChanges.pipe(startWith(this.parentForm.at(0).get('idMezzo').value))
    ]).pipe(
      map(([apiResult, search, selectedValue]: [any[], string, number]) => {
        let results = apiResult;
        if (search) {
          results = apiResult.filter(option => option.identificativo.trim().toLowerCase().includes(search.trim().toLowerCase()));
        }
        if (selectedValue) {
          const index = results.findIndex(element => element.id === this.parentForm.at(0).get('idMezzo').value);
          if (index !== -1) {
            results.unshift(results.splice(index, 1)[0]);
          }
        }
        return results;
      })
    );
  }

  // ? Modale per l'aggiunta di un nuovo mezzo
  aggMezzo($event): void {
    if ($event === 'addMezzo') {
      this.dialogService.open(MezzoModalComponent)
        .onClose.subscribe(submitData => {
          if (submitData) {
            this.getVehicleANDEnableSearch();
            this.parentForm.at(0).get('idMezzo').patchValue(submitData.id);
          } else {
            this.parentForm.at(0).get('idMezzo').patchValue(null);
          }
        });
    }
  }

  onEdit(data): void {
    this.UNonEdit = data.modificaDati.subscribe(resp => {
      if ((resp.mezzo) && (resp.mezzo.length > 0)) {
        if (this.modifica === true) {
          for (let i = 0; i < resp.mezzo.length; i++) {
            if (this.parentForm.length < resp.mezzo.length) {
              this.add();
            }
            this.parentForm.at(i).get('idMezzo').patchValue(resp.mezzo[i].idMezzo);

            this.getVehicleANDEnableSearch();
          }
        }
      } else if (resp[0] !== undefined) {
        if (this.modifica === true) {
          this.parentForm.at(0).get('idMezzo').patchValue(resp[0].idMezzo);

          this.getVehicleANDEnableSearch();
        }
      } else {
        console.warn('Nessun mezzo collegato!');
      }
    });
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      this.getVehicleANDEnableSearch();
      this.outForm.emit(this.parentForm);
    } else {
      alert('Non puoi aggiungere più di ' + this.max + ' mezzi');
    }
  }

  remove(i: number): void {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
    if (this.parentForm.length < 1) {
      this.add();
    }
  }

  ngOnDestroy(): void {
    if (this.UNonEdit) {
      this.UNonEdit.unsubscribe();
    }
  }

}
