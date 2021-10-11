import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import * as globals from '../../../environments/globals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipologiaService {

  private apiUrl: string = environment.apiURL + 'v4/tipologia';

  loggedUser = globals.userid;

  modificaDati: EventEmitter<any>;

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': `${this.loggedUser}`,
    'Cache-Control': 'no-cache'
  });

  constructor(private http: HttpClient) {
    this.modificaDati = new EventEmitter<any>();
  }

  getAll(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any[]>(`${this.apiUrl}`, { headers: this.headers })
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  modificaByID(params) {
    this.headers = this.headers.set('Authorization', globals.userid);
    const request = this.http.get<any>(`${this.apiUrl}/${params}`, { headers: this.headers })
      .pipe(
        catchError(this.errorHandl)
      ).subscribe(
        data => {
          this.modificaDati.emit(data);
        }
      );
    return request;
  }

  filterByID(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    const request = this.http.get<any>(`${this.apiUrl}/${params}`, { headers: this.headers })
      .pipe(
        catchError(this.errorHandl)
      );
    return request;
  }

  addTipologia(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.post<any[]>(`${this.apiUrl}`, params, { headers: this.headers })
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  putTipologia(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.put<any>(`${this.apiUrl}/${params.id}`, params, { headers: this.headers })
      .pipe(
        catchError(this.errorHandl)
      );
  }

  deleteTipologia(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.delete<any>(`${this.apiUrl}/` + params, { headers: this.headers })
      .pipe(
        catchError(this.errorHandl)
      );
  }

  errorHandl(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
