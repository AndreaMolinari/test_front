import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventiListaComponent } from './eventi-lista/eventi-lista.component';


const routes: Routes = [
  {
    path: 'lista',
    component: EventiListaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventiRoutingModule { }
