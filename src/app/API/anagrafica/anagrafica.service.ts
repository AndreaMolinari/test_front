import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import * as globals from '../../../environments/globals';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnagraficaService {

  private url: string = environment.apiURL + 'v4/anagrafica';

  loggedUser = globals.userid;

  modificaDati: EventEmitter<any> = new EventEmitter<any>();
  loadAnagraficaRelazioneData: EventEmitter<any> = new EventEmitter<any>();

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': `${this.loggedUser}`,
    'Cache-Control': 'no-cache'
  });

  constructor(private http: HttpClient) { }

  // Interroga le API per ricevere la lista di tutte le anagrafiche [LISTA]
  getAll(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any[]>(this.url, { headers: this.headers });
  }

  getLatest(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any[]>(this.url + '/latests', { headers: this.headers });
  }

  getAllShort(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any[]>(`${this.url}/short`, { headers: this.headers });
  }

  // Interroga le API per ricevere una specifica anagrafica [MODIFICA {ID}]
  filterByID(params): Subscription {
    this.headers = this.headers.set('Authorization', globals.userid);
    const request = this.http.get<any>(`${this.url}/${params}`, { headers: this.headers })
      .subscribe(
        data => {
          this.modificaDati.emit(data);
        }
      );
    return request;
  }

  // Interroga le API per ricevere una specifica anagrafica [MODIFICA {ID}]
  observableFilterByID(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any>(`${this.url}/${params}`, { headers: this.headers });
  }

  getPIVA(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.post<any>(`${this.url}/validpiva`, params, { headers: this.headers });
  }

  filterByTipologia(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any>(`${this.url}/tipologia/${params}`, { headers: this.headers });
  }

  filterByTipologia_short(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any>(`${this.url}/short/${params}`, { headers: this.headers });
  }

  // Interroga le API per aggiungere una nuova anagrafica  [CREA {ID}]
  addAnagrafica(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.post<any>(`${this.url}`, params, { headers: this.headers });
  }

  putAnagrafica(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.put<any>(`${this.url}/${params.id}`, params, { headers: this.headers });
  }

  // Interroga le API per eliminare una anagrafica [LISTA {ID}]
  deleteAnagrafica(params): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.delete<any>(`${this.url}/` + params, { headers: this.headers });
  }

  deleteRelazioneAnagrafica(id: number): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.delete<any>(`${this.url}/relazione/` + id, { headers: this.headers });
  }

  loadAnagraficaRelazione(data: Array<object>): void {
    this.loadAnagraficaRelazioneData.emit(data);
  }
}
