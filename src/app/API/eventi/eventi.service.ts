import { Injectable, EventEmitter } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import * as globals from '../../../environments/globals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventiService {

  private apiURL: string = environment.apiURL + 'v4/evento';

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
    return this.httpClient.get<any[]>(this.apiURL, { headers: this.headers })
      .pipe(
        retry(1),
        catchError(this.errorHandl)
      )
  }

  filterByID(params) {
    this.headers = this.headers.set('Authorization', globals.userid);
    const request = this.httpClient.get<any>(`${this.apiURL}/${params}`, { headers: this.headers })
      .pipe(
        catchError(this.errorHandl)
      ).subscribe(
        data => {
          this.modificaDati.emit(data);
        }
      )
    return request;
  }

  addEventi(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.post<any>(`${this.apiURL}`, params, { headers: this.headers })
      .pipe(
        catchError(this.errorHandl)
      );
  }

  putEventi(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.put<any>(`${this.apiURL}/${params.id}`, params, { headers: this.headers })
      .pipe(
        catchError(this.errorHandl)
      );
  }

  deleteEventi(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.delete<any>(`${this.apiURL}/` + params, { headers: this.headers })
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
    return throwError(errorMessage);
  }
}
