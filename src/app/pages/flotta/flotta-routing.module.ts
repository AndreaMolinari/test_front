import { NgModule } from '@angular/core';
import { Routes, RouterModule } from "@angular/router";
import { FlottaComponent } from './flotta.component';
import { FlottaAggiungiComponent } from './flotta-aggiungi/flotta-aggiungi.component';
import { FlottaListaComponent } from './flotta-lista/flotta-lista.component';

const routes: Routes = [
    {
        path: '',
        component: FlottaComponent,
        children: [
            {
                path: 'aggiungi',
                component: FlottaAggiungiComponent
            },
            {
                path: 'aggiungi/:idServizio',
                component: FlottaAggiungiComponent
            },
            {
                path: 'modifica/:id',
                component: FlottaAggiungiComponent
            },
            {
                path: 'lista',
                component: FlottaListaComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FlottaRoutingModule { }