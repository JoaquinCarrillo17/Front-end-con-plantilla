import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HabitacionesGuestComponent } from './habitaciones-guest.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: HabitacionesGuestComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HabitacionesGuestRoutingModule { }
