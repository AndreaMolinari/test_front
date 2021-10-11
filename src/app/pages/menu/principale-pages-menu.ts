import { NbMenuItem } from '@nebular/theme';


// ? ░█████╗░  ██████╗░  ███████╗  ██████╗░  ░█████╗░  ████████╗  ░█████╗░  ██████╗░  ███████╗
// ? ██╔══██╗  ██╔══██╗  ██╔════╝  ██╔══██╗  ██╔══██╗  ╚══██╔══╝  ██╔══██╗  ██╔══██╗  ██╔════╝
// ? ██║░░██║  ██████╔╝  █████╗░░  ██████╔╝  ███████║  ░░░██║░░░  ██║░░██║  ██████╔╝  █████╗░░
// ? ██║░░██║  ██╔═══╝░  ██╔══╝░░  ██╔══██╗  ██╔══██║  ░░░██║░░░  ██║░░██║  ██╔══██╗  ██╔══╝░░
// ? ╚█████╔╝  ██║░░░░░  ███████╗  ██║░░██║  ██║░░██║  ░░░██║░░░  ╚█████╔╝  ██║░░██║  ███████╗
// ? ░╚════╝░  ╚═╝░░░░░  ╚══════╝  ╚═╝░░╚═╝  ╚═╝░░╚═╝  ░░░╚═╝░░░  ░╚════╝░  ╚═╝░░╚═╝  ╚══════╝

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Dashboard',
        icon: 'home',
        link: '/pages/dashboard',
        home: true
    },{
        title: 'Anagrafica',
        icon: 'people',
        link: '/pages/anagrafica/lista',
        children: [
            {
                title: 'Cliente',
                icon: 'person-add',
                link: '/pages/anagrafica/lista/cliente'
            },
            {
                title: 'Commerciale',
                icon: 'person-add',
                link: '/pages/anagrafica/lista/commerciale'
            },
            {
                title: 'Officina',
                icon: 'person-add',
                link: '/pages/anagrafica/lista/officina'
            },
            {
                title: 'Autista',
                icon: 'person-add',
                link: '/pages/anagrafica/lista/autista'
            },
            {
                title: 'Installatore',
                icon: 'person-add',
                link: '/pages/anagrafica/lista/installatore'
            },
            {
                title: 'Fornitore',
                icon: 'person-add',
                link: '/pages/anagrafica/lista/fornitore'
            },
            {
                title: 'Agente',
                icon: 'person-add',
                link: '/pages/anagrafica/lista/agente'
            }
        ]
    }, {
        title: 'Servizio',
        icon: 'flash',
        link: '/pages/servizio/lista',
        children: [
            {
                title: 'Servizi Attivi',
                icon: 'flash',
                link: '/pages/servizio/listaAttivi',
            },
            {
                title: 'Servizi Scaduti',
                icon: 'flash-off-outline',
                link: '/pages/servizio/listaScaduti'
            },
            {
                title: 'Servizi Futuri',
                icon: 'flash-off-outline',
                link: '/pages/servizio/listaFuturi'
            },
            {
                title: 'Mostra tutti',
                icon: 'flash',
                link: '/pages/servizio/lista'
            }
        ]
    }, {
        title: 'Flotta',
        icon: 'layers',
        link: '/pages/flotta/lista'
    }, {
        title: 'Mezzo',
        icon: 'car',
        link: '/pages/mezzo/lista',
        children: [
            {
                title: 'Aggiungi Mezzo',
                icon: 'plus',
                link: '/pages/mezzo/aggiungi',
            },
            {
                title: 'Lista Mezzi',
                icon: 'list',
                link: '/pages/mezzo/lista',
            }, {
                title: 'Lista Brand',
                icon: 'cube',
                link: '/pages/brand/lista'
            }, {
                title: 'Lista Modelli',
                icon: 'options-2',
                link: '/pages/modello/lista'
            }
        ]
    }, {
        title: 'Componente',
        icon: 'radio',
        link: '/pages/componente/lista',
        children: [
            {
                title: 'Aggiungi',
                icon: 'plus',
                link: '/pages/componente/aggiungi',
            },
            {
                title: 'Lista',
                icon: 'list',
                link: '/pages/componente/lista',
            }
        ]
    }, {
        title: 'Tachigrafo',
        icon: 'clipboard',
        link: '/pages/tacho/lista',
        children: [
            {
                title: 'Aggiungi',
                icon: 'plus',
                link: '/pages/tacho/aggiungi',
            },
            {
                title: 'Lista',
                icon: 'list',
                link: '/pages/tacho/lista',
            }
        ]
    }, {
        title: 'Radiocomando',
        icon: 'wifi',
        link: '/pages/radiocomando/lista',
        children: [
            {
                title: 'Aggiungi',
                icon: 'plus',
                link: '/pages/radiocomando/aggiungi',
            },
            {
                title: 'Lista',
                icon: 'list',
                link: '/pages/radiocomando/lista',
            }
        ]
    }, {
        title: 'Sim',
        icon: 'phone',
        link: '/pages/sim/lista',
        children: [
            {
                title: 'Aggiungi',
                icon: 'plus',
                link: '/pages/sim/aggiungi',
            },
            {
                title: 'Lista',
                icon: 'list',
                link: '/pages/sim/lista',
            }
        ]
    }, {
        title: 'Utility',
        icon: 'folder',
        children: [
            {
                title: 'Attivazioni MLS',
                icon: 'browser',
                link: '/pages/check_mls'
            }, {
                title: 'Utente',
                icon: 'person',
                link: '/pages/utente/lista',
            }
        ]
    }
];
