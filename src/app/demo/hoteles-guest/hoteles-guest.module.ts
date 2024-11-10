import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { HotelesGuestRoutingModule } from './hoteles-guest-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HotelesGuestRoutingModule,
    SharedModule,
    NgMultiSelectDropDownModule
  ]
})
export class HotelesGuestModule { }
