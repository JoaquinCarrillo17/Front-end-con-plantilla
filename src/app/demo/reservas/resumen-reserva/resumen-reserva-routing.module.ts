import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResumenReservaComponent } from './resumen-reserva.component';



const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ResumenReservaComponent,
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResumenReservaRoutingModule { }
