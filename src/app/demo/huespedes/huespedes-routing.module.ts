import { NgModule } from '@angular/core';
import { GuestListComponent } from './guest-list/guest-list.component';
import { AddGuestComponent } from './add-guest/add-guest.component';
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
