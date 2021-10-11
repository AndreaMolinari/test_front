import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import * as globals from '../../../environments/globals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ModelloService {

  private apiUrl: string = environment.apiURL + 'v4/modello';

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
    return this.httpClient.get<any[]>(this.apiUrl, { headers: this.headers })
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  filterByID(params) {
    this.headers = this.headers.set('Authorization', globals.userid);
    const request = this.httpClient.get<any>(`${this.apiUrl}/${params}`, { headers: this.headers })
      .pipe(
        catchError(this.errorHandl)
      ).subscribe(
        data => {
          this.modificaDati.emit(data);
        }
      );
    return request;
  }

  filterByTipologia(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any>(this.apiUrl + `/tipologia/${params}`, { headers: this.headers })
      .pipe(
        catchError(this.errorHandl)
      );
  }

  addModello(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.post<any>(`${this.apiUrl}`, params, { headers: this.headers })
      .pipe(
        catchError(this.errorHandl)
      );
  }

  putModello(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.put<any>(`${this.apiUrl}/${params.id}`, params, { headers: this.headers })
      .pipe(
        catchError(this.errorHandl)
      );
  }

  deleteModello(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.delete<any>(`${this.apiUrl}/` + params, { headers: this.headers })
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
