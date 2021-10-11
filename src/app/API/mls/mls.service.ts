import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import * as globals from 'src/environments/globals';

@Injectable({
  providedIn: 'root'
})
export class MlsService {

  private apiUrl: string = environment.apiURL + 'v4/check_mls';

  loggedUser = globals.userid;

  myHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Authorization': `${this.loggedUser}`,
    'Cache-Control': 'no-cache'
  });

  constructor(private httpClient: HttpClient) { }

  filterList(params: object): Observable<any> {
    this.myHeaders = this.myHeaders.set('Authorization', globals.userid);
    return this.httpClient.post<any[]>(this.apiUrl, params, { headers: this.myHeaders });
  }

}
