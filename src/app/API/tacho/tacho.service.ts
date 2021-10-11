import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as globals from 'src/environments/globals';

@Injectable({
  providedIn: 'root'
})
export class TachoService {

  private APIurl: string = environment.apiURL + 'v4/tacho';

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

  filterByID(params) {
    this.headers = this.headers.set('Authorization', globals.userid);
    const request = this.httpClient.get<any>(this.APIurl + '/' + params, { headers: this.headers })
      .subscribe(
        data => {
          this.modificaDati.emit(data);
        }, error => { console.error('Errore API', error); }
      );
    return request;
  }

  addTacho(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.post<any>(this.APIurl, params, { headers: this.headers });
  }

  putTacho(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.put<any>(this.APIurl + '/' + params.id, params, { headers: this.headers });
  }

  getAllNonAssociati(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any[]>(this.APIurl + `/nonassociato`, { headers: this.headers });
  }

  getNonAssociati(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.httpClient.get<any[]>(this.APIurl + `/nonassociato/${params}`, { headers: this.headers });
  }
}
