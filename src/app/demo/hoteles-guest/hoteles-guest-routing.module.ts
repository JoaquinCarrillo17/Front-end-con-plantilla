import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HotelesGuestComponent } from './hoteles-guest.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: HotelesGuestComponent,
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HotelesGuestRoutingModule { }
