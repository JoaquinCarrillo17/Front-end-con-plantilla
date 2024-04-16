import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuestListComponent } from './guest-list/guest-list.component';
import { AddGuestComponent } from './add-guest/add-guest.component';
import { RegisterGuestRoomComponent } from './register-guest-room/register-guest-room.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: GuestListComponent,
      },
      {
        path: '',
        component: AddGuestComponent,
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HuespedesRoutingModule { }
