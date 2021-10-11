import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, Subscription, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import * as globals from '../../../environments/globals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FlottaService {
  private apiUrl: string = environment.apiURL + 'v4/flotta';

  loggedUser = globals.userid;
  modificaDati: EventEmitter<any> = new EventEmitter<any>();

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': `${this.loggedUser}`,
    'Cache-Control': 'no-cache'
  });

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any[]>(`${this.apiUrl}`, { headers: this.headers });
  }

  utenteFlotta(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any[]>(`${this.apiUrl}/utente/${params}`, { headers: this.headers });
  }

  servizioFlotta(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any[]>(`${this.apiUrl}/servizio/${params}`, { headers: this.headers });
  }

  filterByID(idServizio): Subscription {
    this.headers = this.headers.set('Authorization', globals.userid);
    const request = this.http.get<any>(this.apiUrl + '/' + idServizio, { headers: this.headers })
      .subscribe(
        data => {
          this.modificaDati.emit(data);
        }
      );
    return request;
  }

  filterByID_OBS(idServizio): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any>(this.apiUrl + '/' + idServizio, { headers: this.headers });
  }

  addFlotta(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.post<any>(`${this.apiUrl}`, params, { headers: this.headers });
  }

  putFlotta(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.put<any>(`${this.apiUrl}/${params.id}`, params, { headers: this.headers });
  }

  deleteFlotta(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.delete<any>(`${this.apiUrl}/` + params, { headers: this.headers });
  }

  deleteServizioFromFlotta(idFlotta: number, idServizio: number): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.delete<any>(`${this.apiUrl}/${idFlotta}/servizio/${idServizio}`, { headers: this.headers });
  }

  sanitizeServizio(idFlotta: number): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any>(this.apiUrl + '/sanitize/' + idFlotta, { headers: this.headers });
  }
}
