import { NbMenuItem } from '@nebular/theme';


// ? ██████╗░  ██╗  ██╗░░░██╗  ███████╗  ███╗░░██╗  ██████╗░  ██╗  ████████╗   ░█████╗░  ██████╗░  ███████╗
// ? ██╔══██╗  ██║  ██║░░░██║  ██╔════╝  ████╗░██║  ██╔══██╗  ██║  ╚══██╔══╝   ██╔══██╗  ██╔══██╗  ██╔════╝
// ? ██████╔╝  ██║  ╚██╗░██╔╝  █████╗░░  ██╔██╗██║  ██║░░██║  ██║  ░░░██║░░░   ██║░░██║  ██████╔╝  █████╗░░
// ? ██╔══██╗  ██║  ░╚████╔╝░  ██╔══╝░░  ██║╚████║  ██║░░██║  ██║  ░░░██║░░░   ██║░░██║  ██╔══██╗  ██╔══╝░░
// ? ██║░░██║  ██║  ░░╚██╔╝░░  ███████╗  ██║░╚███║  ██████╔╝  ██║  ░░░██║░░░   ╚█████╔╝  ██║░░██║  ███████╗
// ? ╚═╝░░╚═╝  ╚═╝  ░░░╚═╝░░░  ╚══════╝  ╚═╝░░╚══╝  ╚═════╝░  ╚═╝  ░░░╚═╝░░░   ░╚════╝░  ╚═╝░░╚═╝  ╚══════╝

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Dashboard',
        icon: 'home',
        link: '/pages/dashboard',
        home: true
    }, {
        title: 'Anagrafica',
        icon: 'people',
        link: '/pages/anagrafica/lista'
    }, {
        title: 'Servizio',
        icon: 'flash',
        link: '/pages/servizio/lista'
    }, {
        title: 'Flotta',
        icon: 'layers',
        link: '/pages/flotta/lista'
    }, {
        title: 'Utente',
        icon: 'person',
        link: '/pages/utente/lista',
    }
];
