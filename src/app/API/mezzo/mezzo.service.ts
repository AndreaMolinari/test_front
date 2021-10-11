import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import * as globals from '../../../environments/globals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MezzoService {
  private apiURL: string = environment.apiURL + 'v4/mezzo';

  loggedUser = globals.userid;
  modificaDati: EventEmitter<any> = new EventEmitter<any>();

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
    return this.httpClient.get<any[]>(`${this.apiURL}`, { headers: this.headers });
  }

  getAllNonAssociati(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any[]>(`${this.apiURL}/nonassociato`, { headers: this.headers });
  }

  getNonAssociati(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any[]>(`${this.apiURL}/nonassociato/${params}`, { headers: this.headers });
  }

  filterByID(params): Subscription {
    this.headers = this.headers.set('Authorization', globals.userid);
    const request = this.httpClient.get<any>(`${this.apiURL}/${params}`, { headers: this.headers })
      .subscribe(
        data => {
          this.modificaDati.emit(data);
        }
      )
    return request;
  }

  addMezzo(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.post<any>(`${this.apiURL}`, params, { headers: this.headers });
  }

  putMezzo(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.put<any>(`${this.apiURL}/${params.id}`, params, { headers: this.headers });
  }

  deleteMezzo(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.delete<any>(`${this.apiURL}/` + params, { headers: this.headers });
  }
}
