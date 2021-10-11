import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ComponenteService } from 'src/app/API/componente/componente.service';
import { NbDialogService } from '@nebular/theme';
import { ComponenteModalComponent } from '../../modals/componente-modal/componente-modal.component';
import { ComponentePipe } from 'src/app/API/PIPES/componente/componente.pipe';
import * as env from 'src/environments/env';
import { DatePipe } from '@angular/common';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { TachoService } from 'src/app/API/tacho/tacho.service';
import { map, share, startWith, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'shared-componente-seleziona',
  templateUrl: './componente-seleziona.component.html',
  styleUrls: ['./componente-seleziona.component.less']
})

export class ComponenteSelezionaComponent implements OnInit, OnDestroy {
  env = environment;
  isRivenditore = env.rivenditore;

  @Output() outForm = new EventEmitter<FormArray>();
  @Input() parentForm: FormArray;
  @Input() source = 'componente';
  @Input() max = 99;
  @Input() modifica: boolean;
  @Input() dataInstance: any;
  @Input() duplicato: boolean;

  idTipologia = 30;
  giaPrincipale = false;

  questoForm: FormGroup;

  expandPannel: boolean[] = [];

  arrayComponenti: any[] = [];
  arrayComponentiFiltered: Observable<string[]> = new Observable<string[]>();
  selectComponenti: FormControl = new FormControl();

  dataRestituzione: any[] = [];
  ricalcoloIndirizzi: any[] = [];

  filteredComponents: Observable<any[]>[] = [];

  apiCall!: Observable<any>;

  // ? RUNTIME VARIABLES
  UNonEdit: Subscription;

  constructor(
    private fb: FormBuilder,
    private apiComponente: ComponenteService,
    private apiTacho: TachoService,
    private componentePipe: ComponentePipe,
    private dialogService: NbDialogService,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute
  ) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.apiCall = (this.source === 'componente')
        ? this.apiComponente.getNonAssociati(this.activatedRoute.snapshot.paramMap.get('id'))
        : this.apiTacho.getNonAssociati(this.activatedRoute.snapshot.paramMap.get('id'));
    } else {
      this.apiCall = (this.source === 'componente')
        ? this.apiComponente.getAllNonAssociati()
        : this.apiTacho.getAllNonAssociati();
    }
    this.apiCall = this.apiCall.pipe(share()); // ? Lo rendo MULTICAST così faccio la chiamata una volta

    this.questoForm.setControl('parentForm', this.parentForm);
    if (this.modifica === true) {
      this.onEdit(this.dataInstance);
    } else if (this.duplicato === true) {
      this.add();
      this.onEdit(this.dataInstance);
    } else {
      this.add();
    }

    // setInterval(() => console.log(this.filteredComponents, this.datePipe.transform(new Date(), 'HH:mm:ss')), 1000);
  }

  crea(): FormGroup {
    if (this.modifica === true) {
      return this.fb.group({
        idServizioComponente: [], // * Questo è id Relazione, serve per le modifiche
        idComponente: [], // * Questo è quello che selezioni dalla select
        principale: [true],
        parziale: [true],
        restituzione: [],
        dataRestituzione: [],
        autocomplete: ['']
      });
    } else {
      return this.fb.group({
        idComponente: [], // * Questo è quello che selezioni dalla select
        principale: [true],
        parziale: [true],
        restituzione: [],
        dataRestituzione: [''],
        autocomplete: ['']
      });
    }
  }

  checkPrincipale(i: number): void {
    this.parentForm.controls.forEach((formGroup: FormGroup, index: number) => {
      if (index !== i) {
        formGroup.get('principale').setValue(false);
      }
    });
  }

  // checkPrincipale(i: number): void {
  //   const asFormArray = this.questoForm.get('parentForm') as FormArray;
  //   for (let x = 0; x <= (asFormArray.length - 1); x++) {
  //     if (this.parentForm.at(x).get('principale').value === true && x !== i) {
  //       this.parentForm.at(x).get('principale').patchValue(false);
  //     }
  //   }
  // }

  checkRestituzione(i: number): void {
    if (this.parentForm.at(i).get('restituzione').value === true) {
      this.dataRestituzione[i] = true;
    } else { this.dataRestituzione[i] = false; }
  }

  checkRicalcoloIndirizzi(i: number): void {
    this.ricalcoloIndirizzi[i] = (this.ricalcoloIndirizzi[i] === undefined || this.ricalcoloIndirizzi[i] === false) ? true : false;
  }

  ricalcolaIndirizzo(params): void {
    const params2Send = { FromDate: null, ToDate: null, unitcode: null };
    params2Send.FromDate = this.datePipe.transform(params.FromDate, 'yyyy-MM-dd') + ' ' + params.FromTime;
    params2Send.ToDate = this.datePipe.transform(params.ToDate, 'yyyy-MM-dd') + ' ' + params.ToTime;
    const idComponente = this.parentForm.at(0).get('idComponente').value;
    this.arrayComponenti.forEach(element => {
      if (element.id === idComponente) {
        params2Send.unitcode = element.unitcode;
      }
    });
    this.apiComponente.ricalcoloIndirizzi(params2Send).subscribe({
      next: resp => console.log('SUCCESSO!', resp),
      error: error => console.error('ERRORE ', error)
    });
  }

  isTouched(i: number = 0): void {
    this.parentForm.at(i).get('idComponente').setValidators(Validators.required);
    this.parentForm.at(i).get('idComponente').updateValueAndValidity();
  }

  isUnTouched(i: number = 0): void {
    this.parentForm.at(i).get('idComponente').clearValidators();
    this.parentForm.at(i).get('idComponente').updateValueAndValidity();
  }

  createObservableArray(formArrayIndex: number): void {
    this.filteredComponents[formArrayIndex] = combineLatest([
      this.apiCall.pipe(
        map(resp => resp.sort((a, b) => {
          const textA = a.unitcode.toUpperCase();
          const textB = b.unitcode.toUpperCase();
          return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
        }))
      ),
      this.parentForm.at(formArrayIndex).get('autocomplete').valueChanges.pipe(startWith('')),
      this.parentForm.at(formArrayIndex).get('idComponente').valueChanges.pipe(startWith(this.parentForm.at(formArrayIndex).get('idComponente').value))
    ]).pipe(
      map(([apiResult, search, selectedValue]: [any[], string, number]) => {
        let results = JSON.parse(JSON.stringify(apiResult)) as any[];
        // let results = apiResult;

        if (search) {
          results = results.filter(option => option.unitcode.trim().toLowerCase().includes(search.trim().toLowerCase()));
        }

        if (selectedValue) {
          const index = results.findIndex(element => element.id === this.parentForm.at(formArrayIndex).get('idComponente').value);
          if (index !== -1) {
            results.unshift(results.splice(index, 1)[0]);
          }
        }
        return results;
      })
    );
  }

  // ! removeObservableArray(formArrayIndex: number): void {
  // !   this.filteredComponents.splice(formArrayIndex, 1);
  // !   if (environment.debug) {
  // !     console.warn('Rimuovo array componenti per indice ', formArrayIndex);
  // !   }
  // ! }

  modalAdd(i: number, $event: string): void {
    if ($event === 'addComponente') {
      this.dialogService.open(ComponenteModalComponent)
        .onClose.subscribe(submitData => {
          if (submitData) {
            // this.arrayComponenti.unshift(submitData);
            this.createObservableArray(i);
            this.parentForm.at(i).get('idComponente').patchValue(submitData.id);
          } else {
            this.parentForm.at(i).get('idComponente').patchValue(null);
          }
        });
    }
  }

  onEdit(serviceInstance): void {
    this.UNonEdit = serviceInstance.modificaDati.subscribe({
      next: (resp) => {
        if (this.source === 'tacho') {
          if ((resp.tacho) && (resp.tacho.length > 0)) {
            if (this.modifica === true) {
              resp.tacho = this.componentePipe.transformCheckbox(resp.tacho, true);

              resp.tacho.forEach((unit: any, index: number) => {
                if (this.parentForm.length < resp.tacho.length) {
                  this.add();
                }

                this.parentForm.at(index).get('idComponente').patchValue(unit.idComponente);
                this.parentForm.at(index).get('idServizioComponente').patchValue(unit.idServizioComponente);
                this.parentForm.at(index).get('principale').patchValue(unit.principale);
                this.parentForm.at(index).get('parziale').patchValue(unit.parziale);

                this.createObservableArray(index);
              });
            }
          } else {
            this.add();
            this.createObservableArray(0);
            console.warn('Nessun tacho collegato!');
          }
        } else {
          if ((resp.componente) && (resp.componente.length > 0)) {
            if (this.modifica === true) {
              resp.componente = this.componentePipe.transformCheckbox(resp.componente, true);

              resp.componente.forEach((unit: any, index: number) => {
                if (this.parentForm.length < resp.componente.length) {
                  this.add();
                }

                this.parentForm.at(index).get('idComponente').setValue(unit.idComponente);
                this.parentForm.at(index).get('idServizioComponente').patchValue(unit.idServizioComponente);
                this.parentForm.at(index).get('principale').patchValue(unit.principale);
                this.parentForm.at(index).get('parziale').patchValue(unit.parziale);

                this.createObservableArray(index);
              });
            }
          } else {
            this.add();
            this.createObservableArray(0);
            console.warn('Nessun componente collegato!');
          }
        }
      },
      complete: () => this.UNonEdit.unsubscribe()
    });
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      // if (!this.modifica) {
      this.createObservableArray(this.parentForm.length - 1);
      // }
      this.outForm.emit(this.parentForm);
    } else {
      alert('non puoi aggiungere più di ' + this.max + ' dispositivi');
    }
  }

  remove(i: number): void {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    // ! this.removeObservableArray(i);
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
