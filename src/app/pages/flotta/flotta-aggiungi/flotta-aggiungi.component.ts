import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { FlottaService } from 'src/app/API/flotta/flotta.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { Location } from '@angular/common';
import * as env from 'src/environments/env';
import { ContextModalData, ElencoErroriComponent } from '../../shared/modals/elenco-errori/elenco-errori.component';

@Component({
  selector: 'app-flotta-aggiungi',
  templateUrl: './flotta-aggiungi.component.html',
  styleUrls: ['./flotta-aggiungi.component.less']
})

export class FlottaAggiungiComponent implements OnInit {
  env = env;

  myForm: FormGroup;
  modifica = false;

  dialogConfermaRef;

  constructor(
    private fb: FormBuilder,
    public apiFlotta: FlottaService,
    private activatedRoute: ActivatedRoute,
    private toastrService: NbToastrService,
    private router: Router,
    private location: Location,
    public dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      flotta: this.fb.array([]),
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
      this.apiFlotta.filterByID(urlID);
    }
  }

  onSubmit(): void {
    if (this.modifica === true) {
      this.apiFlotta.putFlotta(this.myForm.value.flotta[0]).subscribe(
        resp => {
          this.toastrService.success('ID flotta: ' + resp, 'Flotta modificata correttamente!');
          this.router.navigate(['/pages/flotta/lista']);
        }, error => {
          this.toastrService.danger(error, 'Flotta NON modificata!');

          if (error.status === 422 && error.error.errors) {
            const dataToModal: ContextModalData = {
              operazione: 'modifica',
              origine: 'flotta',
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
      this.apiFlotta.addFlotta(this.myForm.value.flotta[0]).subscribe(
        resp => {
          this.toastrService.success('ID flotta: ' + resp, 'Flotta aggiunta correttamente!');
          this.router.navigate(['/pages/flotta/lista']);
        }, error => {
          this.toastrService.danger(error, 'Flotta NON aggiunta!');

          if (error.status === 422 && error.error.errors) {
            const dataToModal: ContextModalData = {
              operazione: 'creazione',
              origine: 'flotta',
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

  onReset(): void {
    if (this.modifica === true) {
      this.onEdit();
    } else {
      this.myForm.reset();
    }
  }

  openDialog(dialog: TemplateRef<any>): void {
    this.dialogConfermaRef = this.dialogService.open(dialog);
  }

  sanitizeServizio(): void {
    this.apiFlotta.sanitizeServizio(+this.activatedRoute.snapshot.paramMap.get('id')).subscribe(resp => {
      this.toastrService.success('Flotta sanificata correttamente...', 'Successo!');
      this.dialogConfermaRef.close();
      this.onReset();
    }, () => {
      this.toastrService.danger('Qualcosa è andato storto', 'Operazione fallita!');
      this.dialogConfermaRef.close();
    });
  }

}
