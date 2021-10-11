import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { MezzoService } from 'src/app/API/mezzo/mezzo.service';
import { ModalActionService } from 'src/app/API/modals/modal-action.service';
import { MezzoPipe } from 'src/app/API/PIPES/mezzo/mezzo.pipe';
import { Subscription } from 'rxjs';
import { ContextModalData, ElencoErroriComponent } from '../elenco-errori/elenco-errori.component';

@Component({
  selector: 'shared-mezzo-modal',
  templateUrl: './mezzo-modal.component.html',
  styleUrls: ['./mezzo-modal.component.less']
})
export class MezzoModalComponent implements OnInit, OnDestroy {
  @Input() idMezzo: number;

  myForm: FormGroup = this.fb.group({
    veicolo: this.fb.array([]),
    note: null
  });

  modifica = false;
  loadingData: boolean;

  // ? RUNTIME VARIABLES
  UNmodalData: Subscription;

  constructor(
    private fb: FormBuilder,
    private ref: NbDialogRef<any>,
    public apiMezzo: MezzoService,
    private pipeMezzi: MezzoPipe,
    private modalAcitons: ModalActionService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService
  ) { }

  ngOnInit(): void {

    if (this.idMezzo) {
      this.modifica = true;
      this.apiMezzo.filterByID(this.idMezzo);
    }

  }

  addFormGroup(name: string, form: FormArray): void {
    this.myForm.setControl(name, form);
  }

  onSubmit(): void {
    this.loadingData = true;

    if (this.modifica !== true) {
      this.apiMezzo.addMezzo(this.pipeMezzi.transformFormXModal(this.myForm.value)).subscribe(
        resp => {
          this.loadingData = false;
          this.ref.close(
            {
              id: resp.id,
              identificativo: (this.myForm.value.veicolo[0].targa)
                ? this.myForm.value.veicolo[0].targa : this.myForm.value.veicolo[0].telaio
            }
          );
        },
        error => {
          this.loadingData = false;
          this.toastrService.danger('Si è verifica un problema con l inserimento!', 'ERRORE API!');

          if (error.status === 422 && error.error.errors) {
            const dataToModal: ContextModalData = {
              operazione: 'creazione',
              origine: 'mezzo',
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
      this.apiMezzo.putMezzo(this.pipeMezzi.transformFormXModal(this.myForm.value)).subscribe(
        resp => {
          this.loadingData = false;
          this.ref.close(
            {
              id: resp.id,
              identificativo: (this.myForm.value.veicolo[0].targa)
                ? this.myForm.value.veicolo[0].targa : this.myForm.value.veicolo[0].telaio
            }
          );
        },
        error => {
          this.loadingData = false;
          this.toastrService.danger('Si è verifica un problema con la modifica!', 'ERRORE API!');

          if (error.status === 422 && error.error.errors) {
            const dataToModal: ContextModalData = {
              operazione: 'modifica',
              origine: 'mezzo',
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
    if (this.UNmodalData) { this.UNmodalData.unsubscribe(); }
  }

}
