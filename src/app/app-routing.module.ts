import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { HabitacionesModule } from './demo/habitaciones/habitaciones.module';
import { RolesModule } from './demo/roles/roles.module';

const routes: Routes = [

  {
    path: 'admin',
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
        path: 'roles',
        loadChildren: () =>
          import('./demo/roles/roles.module').then(
            (m) => m.RolesModule,
          ),
      },
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./demo/usuarios/usuarios.module').then(
            (m) => m.UsuariosModule,
          ),
      },
      {
        path: 'hotel-chart',
        loadComponent: () =>
          import('./demo/historicos/historico/historico.component'), /* DECLARO EL HISTORICO CON PUBLIC DEFAULT CLASS.. PARA QUE PUEDA CARGARLO ASI */
        // children: [

        // ]
      },
    ],
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./demo/main-page/main-page.component').then(m => m.MainPageComponent),
        pathMatch: 'full',
      },
      {
        path: 'hoteles',
        loadChildren: () =>
          import('./demo/hoteles-guest/hoteles-guest.module').then(
            (m) => m.HotelesGuestModule,
          ),
      },
      {
        path: 'habitaciones',
        loadChildren: () =>
          import('./demo/habitaciones-guest/habitaciones-guest.module').then(
            (m) => m.HabitacionesGuestModule,
          ),
      },
      {
        path: 'resumen-reserva',
        loadChildren: () =>
          import('./demo/reservas/resumen-reserva/resumen-reserva.module').then(
            (m) => m.ResumenReservaModule,
          ),
      }
    ],
  },

  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./demo/pages/authentication/auth-signin/auth-signin.component').then((m => m.AuthSigninComponent))
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./demo/pages/authentication/auth-signup/auth-signup.component').then((m => m.AuthSignupComponent))
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
