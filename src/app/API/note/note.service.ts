import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import * as globals from '../../../environments/globals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private apiUrl: string = environment.apiURL + 'v4/note';

  loggedUser = globals.userid;

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': `${this.loggedUser}`,
    'Cache-Control': 'no-cache'
  });

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any[]>(`${this.apiUrl}/lista`, { headers: this.headers })
      .pipe(
        retry(1),
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
