import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { NbCardModule, NbButtonModule, NbIconModule } from '@nebular/theme';



@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,

    NbCardModule,
    NbIconModule,
    NbButtonModule
  ]
})
export class SettingsModule { }
