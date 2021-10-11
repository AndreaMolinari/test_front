import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LogAccessiComponent } from './log-accessi.component';
import { LogAccessiListaComponent } from './log-accessi-lista/log-accessi-lista.component';


const routes: Routes = [
  {
    path: '',
    component: LogAccessiComponent,
    children: [
      {
        path: 'lista',
        component: LogAccessiListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LogAccessiRoutingModule { }
