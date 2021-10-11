import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import * as globals from '../../../environments/globals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServizioService {

  private apiurl: string = environment.apiURL + 'v4/servizio';

  loggedUser = globals.userid;

  modificaDati: EventEmitter<any>;

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': 'NO_TOKEN',
    'Cache-Control': 'no-cache'
  });

  constructor(private httpClient: HttpClient) {
    this.modificaDati = new EventEmitter<any>();
  }

  getAll(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any[]>(`${this.apiurl}`, { headers: this.headers });
  }

  getServiziNonInFlotta(idFlotta): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any[]>(this.apiurl + '/flotta' + idFlotta, { headers: this.headers });
  }

  getAttivi(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any[]>(`${this.apiurl}/attivo`, { headers: this.headers });
  }

  getScaduti(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any[]>(`${this.apiurl}/scaduto`, { headers: this.headers });
  }

  getFuturi(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any[]>(`${this.apiurl}/futuro`, { headers: this.headers });
  }

  filterByID(params) {
    this.headers = this.headers.set('Authorization', globals.userid);
    const request = this.httpClient.get<any>(`${this.apiurl}/${params}`, { headers: this.headers }).subscribe(
      data => {
        this.modificaDati.emit(data);
      }
    );
    return request;
  }

  filterByIDOBE(idServizio) {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any>(this.apiurl + '/' + idServizio, { headers: this.headers });
  }

  filterByAnagraficaID(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any>(`${this.apiurl}/anagrafica/${params}`, { headers: this.headers });
  }

  addServizio(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.post<any>(`${this.apiurl}`, params, { headers: this.headers });
  }

  putServizio(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.put<any>(`${this.apiurl}/${params.id}`, params, { headers: this.headers });
  }

  deleteServizio(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.delete<any>(`${this.apiurl}/` + params, { headers: this.headers });
  }
}
