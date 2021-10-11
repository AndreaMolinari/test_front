import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import * as globals from '../../../environments/globals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SimService {

  private url: string = environment.apiURL + 'v4/sim';

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
    return this.http.get<any[]>(this.url, { headers: this.headers })
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  getAllNonAssociati(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any[]>(this.url + `/nonassociato`, { headers: this.headers })
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  getNonAssociatiComponente(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any[]>(this.url + '/nonassociato/componente/' + params, { headers: this.headers })
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  getNonAssociatiServizio(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any[]>(this.url + '/nonassociato/servizio/' + params, { headers: this.headers })
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      );
  }

  filterByID(params) {
    this.headers = this.headers.set('Authorization', globals.userid);
    const request = this.http.get<any>(this.url + '/' + params, { headers: this.headers })
      .pipe(
        catchError(this.errorHandl)
      ).subscribe(
        data => {
          this.modificaDati.emit(data);
        }
      );
    return request;
  }

  addSim(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.post<any>(this.url, params[0], { headers: this.headers })
      .pipe(
        catchError(this.errorHandl)
      );
  }

  putSim(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.put<any>(this.url + '/' + params.id, params, { headers: this.headers })
      .pipe(
        catchError(this.errorHandl)
      );
  }

  deleteSim(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.delete<any>(this.url + `/` + params, { headers: this.headers })
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
