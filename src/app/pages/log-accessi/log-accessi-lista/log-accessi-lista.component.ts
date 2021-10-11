import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { AuthService } from 'src/app/API/auth/auth.service';
import { LogPipe } from 'src/app/API/PIPES/log.pipe';

@Component({
  selector: 'app-log-accessi-lista',
  templateUrl: './log-accessi-lista.component.html',
  styleUrls: ['./log-accessi-lista.component.less']
})
export class LogAccessiListaComponent implements OnInit {

  arrayAccessi = [];
  
  source: LocalDataSource = new LocalDataSource();

  loadingData: Boolean = true;

  settings = {
    actions: {
      columnTitle: 'Azioni',
      add: false,
      edit: false,
      delete: false
    },
    hideSubHeader: true,
    columns: {
      data: {
        title: 'Data',
        type: 'html',
        compareFunction: (dir, a, b) => parseInt(a) >= parseInt(b) ? dir * 1 : dir * -1,
      },
      ora: {
        title: 'Ora',
        type: 'html',
        compareFunction: (dir, a, b) => parseInt(a) >= parseInt(b) ? dir * 1 : dir * -1,
      },
      username: {
        title: 'Username',
        type: 'text'
      },
      tipologia: {
        title: 'Tipologia',
        type: 'text'
      },
      webService: {
        title: 'WebService',
        type: 'text'
      },
      remoteIP: {
        title: 'Remote IP',
        type: 'text',
        compareFunction: (dir, a, b) => parseInt(a) >= parseInt(b) ? dir * 1 : dir * -1,
      }
    }
  }

  constructor( private _apiLogin: AuthService, private _logPipe: LogPipe ) { }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.loadingData = true;
    this._apiLogin.getLog().subscribe(data => {
      this.source.load(this._logPipe.logUtenteLista(data));
      this.loadingData = false;
    })
  }

}
