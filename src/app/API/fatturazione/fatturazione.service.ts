import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as globals from '../../../environments/globals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FatturazioneService {

  private apiUrl: string = environment.apiURL + 'v4/fatturazione';

  loggedUser = globals.userid;

  modificaDati: EventEmitter<any>;

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': `${this.loggedUser}`,
    'Cache-Control': 'no-cache'
  });

  constructor(private httpClient: HttpClient) {
    this.modificaDati = new EventEmitter<any>();
  }

  getAll(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any[]>(this.apiUrl, { headers: this.headers });
  }

  getIBAN(iban: string): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any[]>(environment.apiURL + `v4/anagrafica/fatturazione/iban/` + iban, { headers: this.headers });
  }

  filterByID(params): any {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any>(`${this.apiUrl}/${params}`, { headers: this.headers }).subscribe(data => {
      this.modificaDati.emit(data);
    });
  }

  addFattura(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.post<any>(`${this.apiUrl}`, params, { headers: this.headers });
  }

  putFattura(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.put<any>(`${this.apiUrl}/${params.id}`, params, { headers: this.headers });
  }

  deleteFattura(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.delete<any>(`${this.apiUrl}/` + params, { headers: this.headers });
  }
}
