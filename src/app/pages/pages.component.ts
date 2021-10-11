import { Component, OnInit } from '@angular/core';
import { MENU_ITEMS as menuSuperAdmin } from './menu/superadmin-pages-menu';
import { MENU_ITEMS as menuAdmin } from './menu/admin-pages-menu';
import { MENU_ITEMS as menuOperatore } from './menu/principale-pages-menu';
import { MENU_ITEMS as menuRivenditore } from './menu/mls-pages-menu';
import { NbSidebarService, NbMenuService, NbThemeService } from '@nebular/theme';
import * as globals from '../../environments/globals';
import { DeviceDetectorService } from 'ngx-device-detector';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  env = environment;

  menu;
  userUsername = globals.userUsername;
  userTipologia = globals.userTipologia;
  userAnagrafica = globals.userAnagrafica;
  menuUtente = [
    {
      title: 'Logout',
      icon: 'log-out',
      link: '/auth/logout'
    },
  ];

  style = {
    header: ''
  };

  deviceType: string;
  globals = globals;

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private theme: NbThemeService,
    private deviceService: DeviceDetectorService) {
    if (environment.debug) {
      this.style.header = 'header';
      if (globals.userUsername === 'simone') {
        this.style.header = 'headerSimone';
      }
    }
  }

  ngOnInit(): void {
    switch (globals.userRole) {
      case 1:
        this.menu = menuSuperAdmin;
        break;
      case 2:
        this.menu = menuAdmin;
        break;
      case 3:
        this.menu = menuOperatore;
        break;
      case 4:
        this.menu = menuRivenditore;
        break;
      default:
        this.menu = [];
        break;
    }

    if (this.deviceService.isMobile() === true) {
      this.deviceType = 'mobile';
      globals.changeUserAgent(this.deviceType);
    }

    const temaSelezionato = localStorage.getItem('tema');
    if (temaSelezionato == '0') {
      this.theme.changeTheme('default');
    }
    if (temaSelezionato == '1') {
      this.theme.changeTheme('dark');
    }
  }

  toggleMenu(): boolean {
    this.sidebarService.toggle(true, 'menu');
    return false;
  }

  navigateHome(): boolean {
    this.menuService.navigateHome();
    return false;
  }
}
