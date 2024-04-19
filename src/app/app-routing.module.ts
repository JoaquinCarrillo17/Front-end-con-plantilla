import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { HabitacionesModule } from './demo/habitaciones/habitaciones.module';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'hoteles',
        pathMatch: 'full',
      },
      {
        path: 'hoteles',
        loadChildren: () =>
          import('./demo/hoteles/hoteles.module').then(
            (m) => m.HotelesModule,
          ),
      },
      {
        path: 'habitaciones',
        loadChildren: () =>
          import('./demo/habitaciones/habitaciones.module').then(
            (m) => m.HabitacionesModule,
          ),
      },
      {
        path: 'huespedes',
        loadChildren: () =>
          import('./demo/huespedes/huespedes.module').then(
            (m) => m.HuespedesModule,
          ),
      },
      {
        path: 'servicios',
        loadChildren: () =>
          import('./demo/servicios/servicios.module').then(
            (m) => m.ServiciosModule,
          ),
      },
      {
        path: 'hotel-chart',
        loadComponent: () =>
          import('./demo/historicos/historico/historico.component'),
      },
    ],
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./demo/pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
