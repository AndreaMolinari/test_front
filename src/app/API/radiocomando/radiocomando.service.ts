import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import * as globals from '../../../environments/globals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RadiocomandoService {

  private apiUrl: string = environment.apiURL + 'v4/radiocomando';

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

  getNONASSOCIATO(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any[]>(this.apiUrl + '/nonassociato', { headers: this.headers });
  }

  getNONassociatoIDSERVIZIO(idServizio: number): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any[]>(this.apiUrl + '/nonassociato/' + idServizio, { headers: this.headers });
  }

  filterByID(params) {
    this.headers = this.headers.set('Authorization', globals.userid);
    const request = this.httpClient.get<any>(`${this.apiUrl}/${params}`, { headers: this.headers })
      .subscribe(
        data => {
          this.modificaDati.emit(data);
        }
      );
    return request;
  }

  addRadiocomando(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.post<any>(`${this.apiUrl}`, params, { headers: this.headers });
  }

  putRadiocomando(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.put<any>(`${this.apiUrl}/${params.id}`, params, { headers: this.headers });
  }

  deleteRadiocomando(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.delete<any>(`${this.apiUrl}/` + params, { headers: this.headers });
  }
}
