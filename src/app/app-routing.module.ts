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
        redirectTo: 'dashboard',
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
        path: 'dashboard',
        loadComponent: () => import('./demo/dashboard/dashboard.component'),
      },
      {
        path: 'basic',
        loadChildren: () =>
          import('./demo/ui-elements/ui-basic/ui-basic.module').then(
            (m) => m.UiBasicModule,
          ),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./demo/pages/form-elements/form-elements.module').then(
            (m) => m.FormElementsModule,
          ),
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./demo/pages/tables/tables.module').then(
            (m) => m.TablesModule,
          ),
      },
      {
        path: 'apexchart',
        loadComponent: () =>
          import('./demo/chart/apex-chart/apex-chart.component'),
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
