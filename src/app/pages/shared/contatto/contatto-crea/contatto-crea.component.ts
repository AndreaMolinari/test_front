import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, Form } from '@angular/forms';
import { TipologiaService } from 'src/app/API/tipologia/tipologia.service';
import { LocalDataSource } from 'ng2-smart-table';
import { TipologiaPipe } from 'src/app/API/PIPES/tipologia/tipologia.pipe';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'shared-contatto-crea',
  templateUrl: './contatto-crea.component.html',
  styleUrls: ['./contatto-crea.component.less']
})

export class ContattoCreaComponent implements OnInit, OnDestroy {
  @Output() outForm = new EventEmitter<FormArray>();
  @Input() parentForm: FormArray;
  @Input() max = 99;
  @Input() modifica: boolean;
  @Input() dataInstance: any;

  sourceArray: any[] = [];

  source: LocalDataSource = new LocalDataSource();

  tipologieContatto: any[] = [];

  settings = {
    actions: {
      columnTitle: 'Azioni',
      position: 'right',
      add: true
    },
    pager: {
      perPage: 4
    },
    noDataMessage: 'Nessun contatto',
    hideSubHeader: false,
    mode: 'inline',
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true
    },
    columns: {
      nome: {
        title: 'Nome',
        type: 'text',
        filter: false
      },
      idTipologia: {
        title: 'Tipologia',
        type: 'html',
        filter: false,
        editor: {
          type: 'list',
          config: {
            selectText: 'Tipologia',
            list: this.tipologieContatto,
          }
        },
        valuePrepareFunction: cell => {
          let result = '';
          this.tipologieContatto.forEach(tipologia => {
            if (cell == tipologia.id) {
              result = tipologia.tipologia;
            }
          });
          return result;
        }
      },
      contatto: {
        title: 'Contatto',
        type: 'text',
        filter: false
      },
      predefinito: {
        title: 'Predefinito',
        type: 'text',
        filter: false,
        editor: {
          type: 'list',
          config: {
            selectText: 'Tipologia',
            list: [
              {
                value: 'No',
                title: 'No'
              },
              {
                value: 'Si',
                title: 'Si'
              }
            ]
          }
        }
      }
    },
  };

  questoForm: FormGroup;

  // ? RUNTIME VARIABLES
  UNonEdit: Subscription;

  constructor(
    private fb: FormBuilder,
    private apiTipologia: TipologiaService,
    private pipeTipologia: TipologiaPipe
  ) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.sourceArray.push(this.source);
    this.questoForm.setControl('parentForm', this.parentForm);
    this.add();
    this.tipologiaContatto();
    if (this.modifica === true) {
      this.onEdit(this.dataInstance);
    }
  }

  crea(): FormGroup {
    if (this.modifica === true) {
      return this.fb.group({
        id: [],
        nome: [null],
        descrizione: [null],
        recapito: this.fb.array([])
      });
    } else {
      return this.fb.group({
        nome: [null],
        descrizione: [null],
        recapito: this.fb.array([])
      });
    }
  }

  onCreateContatto($event, index: number): void {
    this.isTouched(index);
    const contattiFigli = this.parentForm.at(index).get('recapito') as FormArray;
    contattiFigli.push(this.fb.control($event.newData));

    $event.confirm.resolve();
  }

  // ! Da controllare
  onEditContatto($event, index: number): void {
    const contattiFigli = this.parentForm.at(index).get('recapito') as FormArray;
    contattiFigli.setValue($event.source.data);
    $event.confirm.resolve();
  }

  // ! Da controllare
  onDeleteContatto($event, index: number): void {
    const contattiFigli = this.parentForm.at(index).get('recapito') as FormArray;
    if (contattiFigli.length === 0) { this.unTouched(index); }
    for (let x = 0; x < contattiFigli.value.length; x++) {
      if ($event.data.id === contattiFigli.at(x).value.id) {
        contattiFigli.removeAt(x);
        $event.confirm.resolve();
      }
    }
  }

  // checkPredefinito(i) {
  //   const asFormArray = this.questoForm.get('parentForm') as FormArray;
  //   for (let x = 0; x <= (asFormArray.length - 1); x++) {
  //     if (this.parentForm.at(x).get('predefinito').value == true && x !== i) {
  //       this.parentForm.at(x).get('predefinito').patchValue(false);
  //     }
  //   }
  // }

  isTouched(i: number): void {
    this.parentForm.at(i).get('nome').setValidators(Validators.required);

    this.parentForm.at(i).get('nome').updateValueAndValidity();
  }

  unTouched(i: number): void {
    this.parentForm.at(i).get('nome').clearValidators();

    this.parentForm.at(i).get('nome').updateValueAndValidity();
  }

  tipologiaContatto(): void {
    this.apiTipologia.filterByID(4).subscribe(data => {
      this.tipologieContatto = this.pipeTipologia.transformNGSelect(data.all_children);
      this.settings = {
        actions: {
          columnTitle: 'Azioni',
          position: 'right',
          add: true
        },
        pager: {
          perPage: 4
        },
        noDataMessage: 'Nessun contatto',
        hideSubHeader: false,
        mode: 'inline',
        add: {
          addButtonContent: '<i class="nb-plus"></i>',
          createButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>',
          confirmCreate: true,
        },
        edit: {
          editButtonContent: '<i class="nb-edit"></i>',
          saveButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>',
          confirmSave: true,
        },
        delete: {
          deleteButtonContent: '<i class="nb-trash"></i>',
          confirmDelete: true,
        },
        columns: {
          nome: {
            title: 'Nome',
            type: 'text',
            filter: false
          },
          idTipologia: {
            title: 'Tipologia',
            type: 'html',
            filter: false,
            editor: {
              type: 'list',
              config: {
                selectText: 'Tipologia',
                list: this.tipologieContatto,
              }
            },
            valuePrepareFunction: cell => {
              let result = '';
              this.tipologieContatto.forEach(tipologia => {
                if (cell == tipologia.id) {
                  result = tipologia.tipologia;
                }
              });
              return result;
            }
          },
          contatto: {
            title: 'Contatto',
            type: 'text',
            filter: false
          },
          predefinito: {
            title: 'Predefinito',
            type: 'text',
            filter: false,
            editor: {
              type: 'list',
              config: {
                selectText: 'Tipologia',
                list: [
                  {
                    value: 'No',
                    title: 'No'
                  },
                  {
                    value: 'Si',
                    title: 'Si'
                  }
                ]
              }
            }
          }
        },
      };
    });
  }

  onEdit(data): void {
    this.UNonEdit = data.modificaDati.subscribe(resp => {
      this.parentForm.reset();
      if (environment.debug) { console.log('MODIFICA/contatto', resp); }
      if ((resp.rubrica !== undefined) && (resp.rubrica.length > 0)) {
        const contattiFigli = this.parentForm.at(0).get('recapito') as FormArray;
        this.parentForm.at(0).get('id').patchValue(resp.rubrica[0].id);
        this.parentForm.at(0).get('nome').patchValue(resp.rubrica[0].nome);
        this.parentForm.at(0).get('descrizione').patchValue(resp.rubrica[0].descrizione);
        resp.rubrica[0].recapito.forEach(contattoSingolo => {
          contattiFigli.push(this.fb.control(contattoSingolo));
        });

        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        resp.rubrica[0].recapito.forEach(contatto => {
          if (contatto.predefinito == 1) {
            contatto.predefinito = 'Si';
          } else {
            contatto.predefinito = 'No';
          }
        });
        this.sourceArray[0].load(resp.rubrica[0].recapito);

        if (resp.rubrica.length > 1) {
          for (let i = 1; i < resp.rubrica.length; i++) {
            if (this.parentForm.length < resp.rubrica.length) { this.add(); }
            const source: LocalDataSource = new LocalDataSource();
            this.sourceArray.push(source);
            const contattiFigli = this.parentForm.at(i).get('recapito') as FormArray;
            this.parentForm.at(i).get('id').patchValue(resp.rubrica[i].id);
            this.parentForm.at(i).get('nome').patchValue(resp.rubrica[i].nome);
            this.parentForm.at(i).get('descrizione').patchValue(resp.rubrica[i].descrizione);
            resp.rubrica[i].recapito.forEach(contattoSingolo => {
              contattiFigli.push(this.fb.control(contattoSingolo));
            });
            // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
            resp.rubrica[i].recapito.forEach(contatto => {
              if (contatto.predefinito == 1) {
                contatto.predefinito = 'Si';
              } else {
                contatto.predefinito = 'No';
              }
            });
            this.sourceArray[i].load(resp.rubrica[i].recapito);
          }
        }
      } else if (resp[0] !== undefined) {
        this.parentForm.at(0).get('id').patchValue(resp[0].id);
        this.parentForm.at(0).get('nome').patchValue(resp[0].nome);
        this.parentForm.at(0).get('descrizione').patchValue(resp[0].descrizione);
        this.parentForm.at(0).get('recapito').setValue(this.fb.control(resp[0].recapito));
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        resp[0].recapito.forEach(contatto => {
          if (contatto.predefinito == 1) {
            contatto.predefinito = 'Si';
          } else {
            contatto.predefinito = 'No';
          }
        });
        this.sourceArray[0].load(resp[0].recapito);
      } else {
        console.log('Nessun contatto collegato!');
      }
    });
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      this.outForm.emit(this.parentForm);
    } else {
      alert('Non puoi aggiungere più di ' + this.max + ' contatti');
    }
  }

  remove(i: number): void {
    this.parentForm = this.questoForm.get('parentForm') as FormArray;
    this.parentForm.removeAt(i);
    this.outForm.emit(this.parentForm);
  }

  ngOnDestroy(): void {
    if (this.UNonEdit) {
      this.UNonEdit.unsubscribe();
    }
  }
}
