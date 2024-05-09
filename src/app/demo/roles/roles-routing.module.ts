import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RolesListComponent } from './roles-list/roles-list.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: RolesListComponent,
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule { }
