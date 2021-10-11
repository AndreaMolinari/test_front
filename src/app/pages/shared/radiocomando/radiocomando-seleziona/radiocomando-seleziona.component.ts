import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogService } from '@nebular/theme';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { RadiocomandoModalComponent } from '../../modals/radiocomando-modal/radiocomando-modal.component';
import { Radiocomando, RadiocomandoAPI } from '../../../../API/radiocomando/radiocomando';
import { Subscription } from 'rxjs';
import { RadiocomandoService } from 'src/app/API/radiocomando/radiocomando.service';
import { ActivatedRoute } from '@angular/router';
import { RadiocomandoPipe } from 'src/app/API/PIPES/radiocomando/radiocomando.pipe';

@Component({
  selector: 'shared-radiocomando-seleziona',
  templateUrl: './radiocomando-seleziona.component.html',
  styleUrls: ['./radiocomando-seleziona.component.less']
})
export class RadiocomandoSelezionaComponent implements OnInit {

  @Output() outForm = new EventEmitter<FormArray>();
  @Input() parentForm: FormArray;
  @Input() max = 999;
  @Input() modifica: boolean;
  @Input() dataInstance: any;

  questoForm: FormGroup;

  datiTabella: Radiocomando[] = [];
  displayedColumns: string[] = ['id', 'unitcode', 'brand', 'modello', 'azioni'];
  tableVirtualSource = new TableVirtualScrollDataSource([]);

  // ? RUNTIME VARIABLE
  UNonEdit: Subscription;

  constructor(
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    private apiRadiocomando: RadiocomandoService,
    private radiocomandoPipe: RadiocomandoPipe,
    private activatedRoute: ActivatedRoute,
  ) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.questoForm.setControl('parentForm', this.parentForm);

    if (this.modifica) {
      this.onEdit(this.dataInstance);
    }
  }

  crea(): FormGroup {
    if (this.modifica === true) {
      return this.fb.group({
        idRadiocomando: [null, Validators.required]
      });
    }
    return this.fb.group({
      idRadiocomando: [null, Validators.required]
    });
  }

  addRadiocomando(): void {
    this.dialogService.open(RadiocomandoModalComponent)
      .onClose.subscribe((returnData: Radiocomando) => {
        if (returnData && Array.isArray(returnData)) {

          returnData.forEach(data => {
            if (this.parentForm.at(0).get('idRadiocomando').value === null) {
              this.parentForm.at(0).get('idRadiocomando').setValue(data.id);
            } else {
              this.parentForm.push(this.fb.group({ idRadiocomando: data.id }));
            }
            this.datiTabella.push(data);
          });

          this.tableVirtualSource = new TableVirtualScrollDataSource(this.datiTabella);

        }
      });
  }

  deleteRadiocomando(element: Radiocomando): void {
    const formArrayIndex = this.parentForm.value.findIndex(val => val.idRadiocomando === element.id);
    if (formArrayIndex !== -1) {
      this.parentForm.removeAt(formArrayIndex);
      this.datiTabella.splice(formArrayIndex, 1);
      this.tableVirtualSource = new TableVirtualScrollDataSource(this.datiTabella);
    }
  }

  onEdit(serviceInstance): void {
    this.datiTabella = [];
    this.UNonEdit = serviceInstance.modificaDati.subscribe({
      next: (resp) => {
        this.apiRadiocomando.getNONassociatoIDSERVIZIO(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe({
          next: (listaRadiocomandi: RadiocomandoAPI[]) => {
            const newListaRadiocomandi = this.radiocomandoPipe.tranformGETall(listaRadiocomandi);
            resp.radiocomando.forEach((unit: any, index: number) => {
              if (this.parentForm.length < resp.radiocomando.length) { this.add(); }
              this.parentForm.at(index).get('idRadiocomando').patchValue(unit.idComponente);
              const thisRadiocomando = newListaRadiocomandi.find(val => val.id === unit.idComponente);
              this.datiTabella.push(thisRadiocomando);
            });
            this.tableVirtualSource = new TableVirtualScrollDataSource(this.datiTabella);
          }
        });
      },
      complete: () => this.UNonEdit.unsubscribe()
    });
  }

  addPLUSdialog(dialog: TemplateRef<any>): void {
    this.dialogService.open(dialog)
      .onClose.subscribe(resp => {
        if (resp) { this.add(); }
      });
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      this.outForm.emit(this.parentForm);
    } else {
      alert('Non puoi aggiungere più di ' + this.max + ' radiocomandi');
    }
  }

  remove(i: number): void {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    if (this.parentForm.length < 1) {
      this.add();
    } else {
      this.outForm.emit(this.parentForm);
    }
  }

}
