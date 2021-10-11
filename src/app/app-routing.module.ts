import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthService } from './API/auth/auth.service';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },

  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    canActivate: [AuthService],
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule)
  },{
    path: '**',
    redirectTo: 'pages'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
