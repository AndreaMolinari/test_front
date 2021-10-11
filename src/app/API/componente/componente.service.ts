import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import * as globals from '../../../environments/globals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComponenteService {

  private APIurl: string = environment.apiURL + 'v4/componente';

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
    return this.httpClient.get<any[]>(this.APIurl, { headers: this.headers });
  }

  getAllNonAssociati(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any[]>(environment.apiURL + `v4/componente/nonassociato`, { headers: this.headers });
  }

  getNonAssociati(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any[]>(environment.apiURL + `v4/componente/nonassociato/${params}`, { headers: this.headers });
  }

  filterByID(params): Subscription {
    this.headers = this.headers.set('Authorization', globals.userid);
    const request = this.httpClient.get<any>(this.APIurl + '/' + params, { headers: this.headers })
      .subscribe(
        data => {
          this.modificaDati.emit(data);
        }
      );
    return request;
  }

  addComponente(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.post<any>(this.APIurl, params, { headers: this.headers });
  }

  addComponenteMassivo(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.post<any>(this.APIurl + '/bulk', params, { headers: this.headers });
  }

  putComponente(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.put<any>(this.APIurl + '/' + params.id, params, { headers: this.headers });
  }

  deleteComponente(params, forceFlag: boolean = false): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.request<any>('delete', this.APIurl + '/' + params, { body: { force: forceFlag }, headers: this.headers });
  }

  ricalcoloIndirizzi(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.put<any>(environment.apiURL + 'v4/componente/rigeneraindirizzo', params, { headers: this.headers });
  }
}
