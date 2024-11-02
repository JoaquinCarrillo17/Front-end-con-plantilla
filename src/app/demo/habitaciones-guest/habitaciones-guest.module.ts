import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HabitacionesGuestRoutingModule } from './habitaciones-guest-routing.module';
import { SharedModule } from 'src/app/theme/shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HabitacionesGuestRoutingModule,
    SharedModule
  ]
})
export class HabitacionesGuestModule { }
