import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoteComponent } from './note.component';
import { NoteAggiungiComponent } from './note-aggiungi/note-aggiungi.component';
import { NoteListaComponent } from './note-lista/note-lista.component';


const routes: Routes = [
  {
    path: '',
    component: NoteComponent,
    children: [
      {
        path: 'aggiungi',
        component: NoteAggiungiComponent
      },{
        path: 'lista',
        component: NoteListaComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoteRoutingModule { }
