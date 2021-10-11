import { Component, OnInit, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ComponenteService } from 'src/app/API/componente/componente.service';

@Component({
  selector: 'shared-ddt-crea',
  templateUrl: './ddt-crea.component.html',
  styleUrls: ['./ddt-crea.component.less']
})
export class DdtCreaComponent implements OnInit, OnDestroy {

  @Output() outForm = new EventEmitter<FormArray>();

  @Input() parentForm: FormArray;
  @Input() max = 99;
  @Input() modifica = false;
  @Input() dataInstance: any;
  cardAccent = 'success';

  questoForm: FormGroup;

  arrayComponenti = [];
  arrayComponentiFiltered: Observable<object[]>;
  selectComponenti: FormControl = new FormControl();

  UNonModifica;

  constructor(private fb: FormBuilder, private apiComponente: ComponenteService) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit() {
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();
    if (this.modifica === true) {
      this.onEdit(this.dataInstance);
    }
    this.getComponenti();
  }

  crea(): FormGroup {
    if (this.modifica === true) {
      return this.fb.group({
        id: [],
        // ! Campi quando sono in modifica
      });
    }
    return this.fb.group({
      // ! Campi quando sono in aggiungi
    });
  }

  getComponenti(): void {
    this.apiComponente.getAllNonAssociati().subscribe(data => {
      this.arrayComponenti = data;
      this.arrayComponentiFiltered = this.selectComponenti.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });
  }

  private _filter(value: string): object[] {
    const filterValue = value.toLowerCase();
    return this.arrayComponenti.filter(option => option.unitcode.indexOf(filterValue) === 0);
  }

  onEdit(data) {
    this.cardAccent = 'warning';
    this.UNonModifica = data.modificaDati.subscribe(data => {
      if (data !== undefined) {
        this.parentForm.at(0).get('id').patchValue(data[0].id);
      }
    })
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      this.outForm.emit(this.parentForm);
    } else {
      alert('Non puoi aggiungere più di ' + this.max + ' elementi');
    }
  }

  remove(i) {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
  }

  ngOnDestroy() {
    if (this.UNonModifica) { this.UNonModifica.unsubscribe(); }
  }


}
