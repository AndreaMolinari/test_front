import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  NbAlertModule,
  NbInputModule,
  NbButtonModule,
  NbCheckboxModule,
  NbCardModule,
  NbIconModule,
  NbLayoutModule,
  NbToastrModule,
  NbSpinnerModule
} from '@nebular/theme';
import { NbAuthModule } from '@nebular/auth';

import { LoginComponent } from './login/login.component';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbLayoutModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    AuthRoutingModule,
    NbAuthModule,
    NbSpinnerModule,
    NbToastrModule.forRoot(),

    NbCardModule,
    ReactiveFormsModule,
    NbIconModule,
  ],
})
export class AuthModule { }
