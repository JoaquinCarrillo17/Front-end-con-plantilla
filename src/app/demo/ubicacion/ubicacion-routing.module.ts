import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UbicacionComponent } from './ubicacion.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: UbicacionComponent,
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UbicacionRoutingModule { }
