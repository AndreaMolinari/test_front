import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, TemplateRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { TipologiaService } from 'src/app/API/tipologia/tipologia.service';
import { UtentePipe } from 'src/app/API/PIPES/utente/utente.pipe';
import { UtenteService } from 'src/app/API/utente/utente.service';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { FlottaService } from 'src/app/API/flotta/flotta.service';
import { Router } from '@angular/router';
import * as env from 'src/environments/env';
import * as globals from 'src/environments/globals';
import { Observable, Subscription } from 'rxjs';
import { AnagraficaService } from 'src/app/API/anagrafica/anagrafica.service';
import { AnagraficaPipe } from 'src/app/API/PIPES/anagrafica/anagrafica.pipe';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'shared-utente-crea',
  templateUrl: './utente-crea.component.html',
  styleUrls: ['./utente-crea.component.less']
})

export class UtenteCreaComponent implements OnInit, AfterViewInit, OnDestroy {
  env = environment;
  userRole: number = globals.userRole;
  
  @Output() outForm = new EventEmitter<FormArray>();
  @Input() parentForm: FormArray;
  @Input() max = 99;
  @Input() modifica = false;
  @Input() origin = 'crud';
  cardAccent: string;
  confermaPassword: any[] = [];
  @Input() dataInstance: any;

  questoForm: FormGroup;

  tipologieUtente = [];

  inputType = [];
  passwordIcon = [];

  hasActia = [];
  passwordStatus = [];
  usernameStatus = [];

  canSetTypos = true;

  sourceFlotta: LocalDataSource = new LocalDataSource();

  settingsFlotta = {
    actions: {
      columnTitle: 'Azioni',
      position: 'right',
      add: false,
      delete: false
    },
    noDataMessage: 'Nessuna flotta collegata all utente',
    mode: 'external',
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    columns: {
      id: {
        title: 'ID',
        filter: false
      },
      nome: {
        title: 'Flotta',
        filter: false
      },
      nickname: {
        title: 'Nickname',
        filter: false
      },
      nservizio: {
        title: 'Numero Servizi',
        filter: false
      }
    }
  };

  arrayAnagrafiche: any[] = [];
  arrayAnagraficheFiltered: Observable<any[]> = new Observable<any[]>();

  UNonEdit: Subscription;
  UNonFlotte: Subscription;
  UNtipologiaUtente: Subscription;

  constructor(
    private fb: FormBuilder,
    private apiTipologia: TipologiaService,
    private apiAnagrafica: AnagraficaService,
    private utenteService: UtenteService,
    private flottaService: FlottaService,
    private pipeUtente: UtentePipe,
    private anagraficaPipe: AnagraficaPipe,
    private toastrService: NbToastrService,
    private router: Router,
    private dialogService: NbDialogService,
  ) {
    this.questoForm = this.fb.group({});
  }

  ngOnInit() {
    this.questoForm.setControl('parentForm', this.parentForm);
    if (this.modifica === true) {
      this.tipologiaUtente();
      this.onEdit(this.dataInstance);
    } else {
      this.add();
      this.tipologiaUtente();
    }

    if (this.origin === 'crud') {
      this.getAnagrafiche();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.cardAccent = (this.origin === 'crud') ? 'success' : '');
    // this.cardAccent = (this.origin === 'crud') ? 'success' : '';
  }

  getAnagrafiche() {
    this.apiAnagrafica.getAllShort().subscribe(data => {
      this.arrayAnagrafiche = this.anagraficaPipe.transformAnagraficaShort(data);
      this.customSearch(0);
    });
  }

  customSearch(i?: number): void {
    if (typeof (i) === 'number') {
      this.arrayAnagraficheFiltered = new Observable<any[]>(observer => {
        observer.next(this._filterAnagrafiche(this.parentForm.at(i).get('autocompleteAnagrafica').value));
      });
    }
  }

  private _filterAnagrafiche(value: string): object[] {
    const filterValue = value.trim().toLowerCase();
    return this.arrayAnagrafiche.filter(option => option.nome.toLowerCase().includes(filterValue));
  }

  getFlotte(indice) {
    this.UNonFlotte = this.flottaService.utenteFlotta(indice).subscribe(data => {
      this.sourceFlotta = data;
    });
  }

  checkUsername($event, i) {
    const params = { username: '', id: '' };
    if ($event.length >= 2) {
      params.username = $event;
      if (this.modifica === true) { params.id = this.parentForm.at(i).get('id').value; }
      this.utenteService.checkUsername(params).subscribe(
        resp => {
          if (resp) {
            this.usernameStatus[i] = 'success';
            this.parentForm.at(i).get('username').setErrors(null);
          } else if (!resp) {
            this.parentForm.at(i).get('username').setErrors({ invalid: true });
            this.usernameStatus[i] = 'danger';
            this.toastrService.danger('', 'Username giù in uso!');
          }
        },
        error => {
          console.error(error);
          this.toastrService.danger('Impossibile confermare username', 'Errore server!');
        });
    } else if ($event.length === 0) { this.usernameStatus[i] = 'basic'; } else { this.usernameStatus[i] = 'danger'; }
  }

  verificaPassword(index: number): void {
    // if (this.modifica) {
    //   this.parentForm.at(index).get('password').clearValidators();
    //   this.parentForm.at(index).get('password').updateValueAndValidity();
    // } else {
    if (this.parentForm.at(index).get('password_confirmation').value === this.parentForm.at(index).get('password').value) {
      if (this.parentForm.at(index).get('password_confirmation').value === '' && this.parentForm.at(index).get('password').value === '') {
        this.passwordStatus[index] = 'basic';
      } else {
        this.passwordStatus[index] = 'success';
        let errors = (this.parentForm.at(index).get('password').errors !== null) ? this.parentForm.at(index).get('password').errors : {};
        delete errors.nomatch;
        if (Object.keys(errors).length === 0) { errors = null; }
        this.parentForm.at(index).get('password').setErrors(errors);
        // this.parentForm.at(index).get('password').setErrors(null);
      }
    } else {
      this.passwordStatus[index] = 'danger';
      const errors = (this.parentForm.at(index).get('password').errors !== null) ? this.parentForm.at(index).get('password').errors : {};
      errors.nomatch = true;
      this.parentForm.at(index).get('password').setErrors(errors);
    }
    // }
  }

  showPassword(index: number) {

    this.inputType[index] = (this.inputType[index] === 'password') ? 'text' : 'password';
    this.passwordIcon[index] = (this.passwordIcon[index] === 'eye') ? 'eye-off' : 'eye';
  }

  actiaUser(i, $event) {
    this.hasActia[i] = $event;
  }

  // !SONO DA CONTROLLARE TUTTE LE FUNZIONI TOUCHED E UNTOUCHED IN TUTTI I FORMINI

  isTouched(i) {
    this.parentForm.at(i).get('idTipologia').setValidators(Validators.required);
    this.parentForm.at(i).get('username').setValidators([Validators.required, Validators.minLength(2)]);
    this.parentForm.at(i).get('password').setValidators([Validators.required, Validators.minLength(6)]);
    this.parentForm.at(i).get('email').setValidators([Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);

    this.parentForm.at(i).get('idTipologia').updateValueAndValidity();
    this.parentForm.at(i).get('username').updateValueAndValidity();
    this.parentForm.at(i).get('password').updateValueAndValidity();
    this.parentForm.at(i).get('email').updateValueAndValidity();
  }

  unTouche(i) {
    this.parentForm.at(i).get('idTipologia').clearValidators();
    this.parentForm.at(i).get('username').clearValidators();
    this.parentForm.at(i).get('password').clearValidators();
    this.parentForm.at(i).get('email').clearValidators();

    this.parentForm.at(i).get('idTipologia').updateValueAndValidity();
    this.parentForm.at(i).get('username').updateValueAndValidity();
    this.parentForm.at(i).get('password').updateValueAndValidity();
    this.parentForm.at(i).get('email').updateValueAndValidity();
  }

  crea(): FormGroup {
    if (this.modifica === true) {
      return this.fb.group({
        id: [],
        idAnagrafica: [],
        autocompleteAnagrafica: [''],
        idTipologia: [],
        username: [null],
        password: [null],
        password_confirmation: [null],
        email: [null],
        bloccato: [],
        hasActia: [],
        actiaUser: [],
        actiaMail: [],
        actiaPassword: []
      });
    } else {
      return this.fb.group({
        idAnagrafica: [null],
        autocompleteAnagrafica: [''],
        idTipologia: [null],
        username: [null],
        password: [null],
        password_confirmation: [null],
        email: [null],
        bloccato: [false],
        hasActia: [false],
        actiaUser: [],
        actiaMail: [],
        actiaPassword: []
      });
    }
  }

  tipologiaUtente(_callback?) {
    const array = [];
    this.UNtipologiaUtente = this.apiTipologia.filterByID(2).subscribe(data => {
      data.all_children.forEach(element => {
        if (env.rivenditore) {
          if (element.id === 99 || element.id === 112) {
            array.push(element);
          }
        }
      });
      if (array.length > 0) { this.tipologieUtente = array; } else { this.tipologieUtente = data.all_children; }
      if (_callback) {
        _callback();
      }
    });
  }

  onEdit(data) {
    this.cardAccent = (this.origin === 'crud') ? 'warning' : 'basic';

    this.UNonEdit = data.modificaDati.subscribe(resp => {
      this.parentForm.reset();

      if ((resp.utente) && (resp.utente.length > 0)) {
        const flags = this.pipeUtente.transformInserimento(resp.utente, true);
        for (let i = 0; i < resp.utente.length; i++) {
          this.confermaPassword[i] = true;
          if (this.parentForm.length < resp.utente.length) { this.add(); }
          this.tipologiaUtente(() => {
            this.isTouched(i);
            this.parentForm.at(i).get('id').patchValue(resp.utente[i].id);

            if (resp.anagrafica) {
              this.parentForm.at(i).get('idAnagrafica').patchValue(resp.anagrafica.id);
            }

            if (resp.utente[i].idTipologia !== undefined) {
              this.parentForm.at(i).get('idTipologia').patchValue(resp.utente[i].idTipologia.toString());
              if (env.rivenditore && resp.utente[i].idTipologia === 112) {
                this.canSetTypos = false;
              }
            }
            this.parentForm.at(i).get('username').patchValue(resp.utente[i].username);
            this.parentForm.at(i).get('email').patchValue(resp.utente[i].email);
            this.parentForm.at(i).get('password').patchValue(resp.utente[i].password_dec);
            this.parentForm.at(i).get('password_confirmation').patchValue(resp.utente[i].password_dec);
            this.verificaPassword(i);
            this.parentForm.at(i).get('bloccato').patchValue(flags[i].bloccato);
            if (resp.utente[i].actiaUser != null && resp.utente[i].actiaUser !== '') {
              this.hasActia[i] = true;
              this.parentForm.at(i).get('hasActia').patchValue(true);
              this.parentForm.at(i).get('actiaUser').patchValue(resp.utente[i].actiaUser);
              this.parentForm.at(i).get('actiaMail').patchValue(resp.utente[i].actiaMail);
              this.parentForm.at(i).get('actiaPassword').patchValue(resp.utente[i].actiaPassword);
            }
          });
        }
      } else if (resp && typeof (resp) === 'object' && resp.utente === undefined) {

        if (this.parentForm.value.length === 0) { this.add(); }

        // const flags = this.pipeUtente.transformInserimento(resp, true);

        this.confermaPassword[0] = true;

        this.tipologiaUtente(() => {
          this.isTouched(0);
          this.parentForm.at(0).get('id').patchValue(resp.id);

          if (resp.anagrafica) {
            this.parentForm.at(0).get('idAnagrafica').patchValue(resp.anagrafica.id);
          }

          if (resp.idTipologia) {
            this.parentForm.at(0).get('idTipologia').patchValue(resp.idTipologia.toString());
            if (env.rivenditore && resp.idTipologia === 112) {
              this.canSetTypos = false;
            }
          }
          this.parentForm.at(0).get('username').patchValue(resp.username);
          this.parentForm.at(0).get('email').patchValue(resp.email);
          this.parentForm.at(0).get('password').patchValue(resp.password_dec);
          this.parentForm.at(0).get('password_confirmation').patchValue(resp.password_dec);

          this.verificaPassword(0);

          this.parentForm.at(0).get('bloccato').patchValue(resp.bloccato);

          if (resp.actiaUser) {
            this.hasActia[0] = true;
            this.parentForm.at(0).get('hasActia').patchValue(true);
            this.parentForm.at(0).get('actiaUser').patchValue(resp.actiaUser);
            this.parentForm.at(0).get('actiaMail').patchValue(resp.actiaMail);
            this.parentForm.at(0).get('actiaPassword').patchValue(resp.actiaPassword);
          }
        });
      } else {
        this.add();
        console.log('Nessun utente collegato!');
      }
    });
  }

  onEditFlotta($event) {
    this.router.navigate(['/pages/flotta/modifica/' + $event.data.id]);
  }

  add(): void {
    if (this.parentForm.length < this.max) {
      this.parentForm = this.questoForm.get('parentForm') as FormArray;
      this.parentForm.push(this.crea());
      this.inputType.push('password');
      this.passwordIcon.push('eye');
      this.confermaPassword.push(false);
      this.outForm.emit(this.parentForm);
    } else {
      alert('Non puoi aggiungere più di ' + this.max + ' utenti');
    }
  }

  remove(i, dialog?: TemplateRef<any>) {
    this.dialogService.open(dialog, { autoFocus: false })
      .onClose.subscribe(data => {
        if (data === true) {
          this.parentForm = this.questoForm.get('parentForm') as FormArray;
          this.parentForm.removeAt(i);
          this.outForm.emit(this.parentForm);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.UNonEdit) {
      this.UNonEdit.unsubscribe();
    }
    if (this.UNonFlotte) {
      this.UNonFlotte.unsubscribe();
    }
  }

}
