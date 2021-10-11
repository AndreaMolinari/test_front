import { Component, OnInit } from '@angular/core';
import * as globals from '../../../environments/globals';
import { CookieService } from 'ngx-cookie-service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/API/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {

  myForm: FormGroup;
  loggedin: boolean;
  loading = false;

  status = '';

  constructor(
    private fb: FormBuilder,
    private cookie: CookieService,
    private apiLogin: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: NbToastrService) { }

  ngOnInit() {
    this.isAuthenticated();
    this.myForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remeberME: [false]
    });
  }

  isCompatible() {
    if (window.localStorage) {
      return true;
    } else {
      this.toastrService.danger('Il tuo dispositivo potrebbe non essere compatibile', 'Impossibile effettuare il login');
      return false;
    }
  }

  isAuthenticated() {
    this.route.data.subscribe(data => {
      if (data.logout === true) {
        this.apiLogin.logout().subscribe();
        sessionStorage.removeItem('userData');
        localStorage.removeItem('userData');
        this.cookie.deleteAll();
      }
    });
    if (this.apiLogin.isAuthenticated() === true) {
      this.router.navigate(['/pages']);
    }
  }

  login() {
    this.loading = true;
    this.apiLogin.login(this.myForm.value).subscribe(
      resp => {
        this.loading = false;
        if (resp.utente.role <= 4) {
          this.loggedin = true;
          const respString = JSON.stringify(resp);
          globals.changeUserID(respString);
          if (this.myForm.value.remeberME === true) {
            localStorage.setItem('userData', respString);
          } else {
            sessionStorage.setItem('userData', respString);
          }
          setTimeout(() => { this.router.navigate(['/pages']); }, 100);
        } else { this.loggedin = false; }
      }, error => {
        this.loading = false;
        this.loggedin = false;
      });
  }
}
