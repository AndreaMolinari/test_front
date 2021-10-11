import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { ComponenteService } from 'src/app/API/componente/componente.service';
import { ModalActionService } from 'src/app/API/modals/modal-action.service';
import { ComponentePipe } from 'src/app/API/PIPES/componente/componente.pipe';
import { ContextModalData, ElencoErroriComponent } from '../elenco-errori/elenco-errori.component';

@Component({
  selector: 'shared-componente-modal',
  templateUrl: './componente-modal.component.html',
  styleUrls: ['./componente-modal.component.less']
})
export class ComponenteModalComponent implements OnInit, OnDestroy {
  @Input() idComponente: number;
  modifica: boolean;

  myForm: FormGroup;
  loadingData: boolean;

  // ? RUNTIME VARIABLES
  UNmodalData: Subscription;

  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<any>,
    public apiComponente: ComponenteService,
    private pipeComponente: ComponentePipe,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      componente: this.fb.array([])
    });

    if (this.idComponente) {
      this.modifica = true;
      this.apiComponente.filterByID(this.idComponente);
    } else {
      this.modifica = false;
    }
  }

  addFormGroup(name: string, form: FormArray): void {
    this.myForm.setControl(name, form);
  }

  onSubmit(): void {
    this.loadingData = true;
    console.log(this.myForm.value.componente[0]);
    if (this.modifica !== true) {
      this.apiComponente.addComponente(this.pipeComponente.transformFormXModal(this.myForm.value)).subscribe(
        resp => {
          this.loadingData = false;
          this.ref.close({ id: resp.id, unitcode: this.myForm.value.componente[0].unitcode });
        },
        error => {
          this.loadingData = false;
          this.toastrService.danger('La modifica NON è andata a buon fine', 'ERRORE API');

          if (error.status === 422 && error.error.errors) {
            const dataToModal: ContextModalData = {
              operazione: 'creazione',
              origine: 'componente',
              errorsList: []
            };

            Object.keys(error.error.errors).forEach(key => {
              if (Array.isArray(error.error.errors)) {
                error.error.errors[key].forEach(errore => {
                  dataToModal.errorsList.push({ icona: 'warning', titolo: key, motivo: errore });
                });
              } else {
                dataToModal.errorsList.push({ icona: 'warning', titolo: key, motivo: error.error.errors[key][0] });
              }
            });

            this.dialogService.open(ElencoErroriComponent, { context: { contextData: dataToModal } });
          }
        }
      );
    } else {
      this.apiComponente.putComponente(this.pipeComponente.transformFormXModal(this.myForm.value)).subscribe(
        resp => {
          this.loadingData = false;
          this.ref.close({ id: resp.id, unitcode: this.myForm.value.componente[0].unitcode });
        },
        error => {
          this.loadingData = false;

          if (error.status === 422 && error.error.errors) {
            const dataToModal: ContextModalData = {
              operazione: 'modifica',
              origine: 'componente',
              errorsList: []
            };

            Object.keys(error.error.errors).forEach(key => {
              if (Array.isArray(error.error.errors)) {
                error.error.errors[key].forEach(errore => {
                  dataToModal.errorsList.push({ icona: 'warning', titolo: key, motivo: errore });
                });
              } else {
                dataToModal.errorsList.push({ icona: 'warning', titolo: key, motivo: error.error.errors[key][0] });
              }
            });

            this.dialogService.open(ElencoErroriComponent, { context: { contextData: dataToModal } });
          }

        }
      );
    }
  }

  onReset(): void {
    this.myForm.reset();
  }

  ngOnDestroy(): void {
    if (this.UNmodalData) {
      this.UNmodalData.unsubscribe();
    }
  }

}
