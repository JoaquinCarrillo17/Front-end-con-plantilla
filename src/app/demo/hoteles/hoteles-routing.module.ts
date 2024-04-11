import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelListComponent } from './hotel-list/hotel-list.component';
import { AddHotelComponent } from './add-hotel/add-hotel.component';
import { LinkHotelServiceComponent } from './link-hotel-service/link-hotel-service.component';
import { LinkHotelRoomComponent } from './link-hotel-room/link-hotel-room.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: HotelListComponent,
      },
      {
        path: '',
        component: AddHotelComponent,
      },
      {
        path: ':id/servicios',
        component: LinkHotelServiceComponent,
      },
      {
        path: ':id/habitaciones',
        component: LinkHotelRoomComponent,
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HotelesRoutingModule { }
