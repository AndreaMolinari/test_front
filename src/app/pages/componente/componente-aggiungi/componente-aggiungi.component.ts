import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ComponenteService } from 'src/app/API/componente/componente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Location } from '@angular/common';
import { ComponentePipe } from 'src/app/API/PIPES/componente/componente.pipe';
import { ContextModalData, ElencoErroriComponent } from '../../shared/modals/elenco-errori/elenco-errori.component';

@Component({
  selector: 'app-componente-aggiungi',
  templateUrl: './componente-aggiungi.component.html',
  styleUrls: ['./componente-aggiungi.component.less']
})
export class ComponenteAggiungiComponent implements OnInit {

  myForm: FormGroup;

  modifica: boolean;

  constructor(
    private fb: FormBuilder,
    public apiComponente: ComponenteService,
    public componentePipe: ComponentePipe,
    private activatedRoute: ActivatedRoute,
    private toastrService: NbToastrService,
    private router: Router,
    private location: Location,
    private dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      componente: this.fb.array([]),
      note: this.fb.array([])
    });
    this.onEdit();
  }

  goBack(): void {
    this.location.back();
  }

  addFormGroup(name: string, form: FormArray): void {
    this.myForm.setControl(name, form);
  }

  onEdit(): void {
    const urlID = this.activatedRoute.snapshot.paramMap.get('id');
    if (urlID !== null) {
      this.modifica = true;
      this.apiComponente.filterByID(urlID);
    }
  }

  onSubmit(): void {
    if (this.modifica === true) {
      this.apiComponente.putComponente(this.componentePipe.transformInserimentoSpecial(this.myForm.value)).subscribe(
        resp => {
          this.toastrService.success('ID componente: ' + resp, 'Componente modificato correttamente!');
          this.router.navigate(['/pages/componente/lista']);
        }, error => {
          this.toastrService.danger(error, 'Componente NON modificato!');

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

        });
    } else {
      this.apiComponente.addComponente(this.componentePipe.transformInserimentoSpecial(this.myForm.value)).subscribe(
        resp => {
          this.toastrService.success('ID componente: ' + resp, 'Componente aggiunto correttamente!');
          this.router.navigate(['/pages/componente/lista']);
        }, error => {
          this.toastrService.danger(error, 'Componente NON aggiunto!');

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
        });
    }
  }

  onMassiveCreate(): void {
    this.router.navigate(['/pages/sim/aggiungi/massiva']);
  }

  onReset(): void {
    if (this.modifica === true) {
      this.onEdit();
    } else {
      this.myForm.reset();
    }
  }

}
