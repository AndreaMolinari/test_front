import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import * as globals from '../../../environments/globals';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as env from 'src/environments/env';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    idWebservice: '90',
    'Cache-Control': 'no-cache'
  });

  constructor(private router: Router, private http: HttpClient, private titleService: Title) { }

  login(params): Observable<any> {
    return this.http.post<any>(environment.apiURL + `login`, params, { headers: this.headers });
  }

  logout(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any>(environment.apiURL + 'logout', { headers: this.headers });
  }

  isAuthenticated(): boolean {
    if (sessionStorage.getItem('userData') !== null) {
      globals.changeUserID(sessionStorage.getItem('userData'));
      this.changeMLSEnvironmnet(sessionStorage.getItem('userData'));
      return true;
    } else if (localStorage.getItem('userData') !== null) {
      globals.changeUserID(localStorage.getItem('userData'));
      this.changeMLSEnvironmnet(localStorage.getItem('userData'));
      return true;
    } else { return false; }
  }

  changeMLSEnvironmnet(userData): void {
    if (JSON.parse(userData).utente.idTipologia === 36) {
      this.titleService.setTitle('WebGest - MLS');
      env.changeRivenditore(true);
    } else {
      this.titleService.setTitle('WebGest - Record Italia');
      env.changeRivenditore(false);
    }
  }

  getLog(): Observable<any> {
    return this.http.get<any[]>(environment.apiURL + `v4/login/log`,
      { headers: { 'Content-Type': 'application/json', idWebservice: '90', userid: globals.userid } });
  }

  canActivate(): boolean {
    const hasUserID = this.isAuthenticated();
    if (!hasUserID) {
      this.router.navigate(['/']);
    }
    return hasUserID;
  }

}
