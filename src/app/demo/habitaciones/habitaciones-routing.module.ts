import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RoomListComponent } from './room-list/room-list.component';
import { AddRoomComponent } from './add-room/add-room.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'list',
        component: RoomListComponent,
      },
      {
        path: '',
        component: AddRoomComponent,
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HabitacionesRoutingModule { }
