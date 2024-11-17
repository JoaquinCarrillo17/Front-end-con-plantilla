import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MisReservasComponent } from './mis-reservas.component';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: MisReservasComponent,
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MisReservasRoutingModule { }
