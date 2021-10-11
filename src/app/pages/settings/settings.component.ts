import { Component, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {

  public now: Date = new Date();

  temi = [
    { id: 0, tema: 'Chiaro' },
    { id: 1, tema: 'Scuro' },
  ];

  constructor(
    private theme: NbThemeService,
    private cookie: CookieService,
    private location: Location
  ) { }

  ngOnInit() {

    setInterval(() => { this.now = new Date(); }, 1);

    const temaSelezionato = this.cookie.get('tema');
    if (temaSelezionato === '0') {
      this.theme.changeTheme('default');
    }
    if (temaSelezionato === '1') {
      this.theme.changeTheme('dark');
    }
  }

  cambiaTema(temi) {
    if (temi.id === '0') {
      console.log('è stato impostato il tema: ', temi.id, ';', temi.tema);
      this.theme.changeTheme('default');
      localStorage.setItem('tema', '0');
    }
    if (temi.id === '1') {
      console.log('è stato impostato il tema: ', temi.id, ';', temi.tema);
      this.theme.changeTheme('dark');
      localStorage.setItem('tema', '1');
    }
  }

  goBack() {
    this.location.back();
  }

}
