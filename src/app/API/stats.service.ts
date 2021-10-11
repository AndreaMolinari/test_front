import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as globals from 'src/environments/globals';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  private myUrl: string = environment.apiURL + 'stats';

  loggedUser = globals.userid;

  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': this.loggedUser
  });

  constructor(private http: HttpClient) { }

  getTachoStats(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any[]>(this.myUrl + '/tacho', { headers: this.headers });
  }

  getGPSStats(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any[]>(this.myUrl + '/gps', { headers: this.headers });
  }

  getApplicativisStats(): Observable<any> {
    this.headers = this.headers.set('Authorization', globals.userid);
    return this.http.get<any[]>(this.myUrl + '/applicativo', { headers: this.headers });
  }
}
