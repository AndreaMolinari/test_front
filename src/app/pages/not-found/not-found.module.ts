import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbLayoutModule, NbCardModule, NbButtonModule, NbIconModule } from '@nebular/theme';
import { NotFoundComponent } from './not-found.component';



@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    CommonModule,

    NbLayoutModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule
  ]
})
export class NotFoundModule { }
