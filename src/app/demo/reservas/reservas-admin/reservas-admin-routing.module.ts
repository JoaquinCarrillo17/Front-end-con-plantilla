import { NgModule } from '@angular/core';
import { ReservasAdminComponent } from './reservas-admin.component';
import { Routes, RouterModule } from '@angular/router';



const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ReservasAdminComponent,
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReservasAdminRoutingModule { }
