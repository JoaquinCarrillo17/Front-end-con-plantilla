import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  children?: Navigation[];
  requiredRoles?: string[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'chart-maps',
    title: 'Estadísticas',
    type: 'group',
    icon: 'icon-charts',
    children: [
      {
        id: 'apexChart',
        title: 'Hoteles Chart',
        type: 'item',
        url: '/admin/hotel-chart',
        classes: 'nav-item',
        icon: 'fa fa-chart-line',
        /*requiredRoles: ['ROLE_HISTORICOS_R', 'ROLE_HISTORICOS_W', 'ROLE_SUPER_ADMIN']*/
      },
    ],
  },
  {
    id: 'entidades',
    title: 'Entidades',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'hoteles',
        title: 'Hoteles',
        type: 'item',
        icon: 'fa fa-home',
        url: '/admin/hoteles',
        requiredRoles: ['ROLE_HOTELES_R', 'ROLE_HOTELES_W', 'ROLE_SUPER_ADMIN']
      },
      {
        id: 'habitaciones',
        title: 'Habitaciones',
        type: 'item',
        icon: 'fa fa-bed',
        url: '/admin/habitaciones',
        requiredRoles: ['ROLE_HABITACIONES_R', 'ROLE_HABITACIONES_W', 'ROLE_SUPER_ADMIN']
      },
      {
        id: 'reservas',
        title: 'Reservas',
        type: 'item',
        icon: 'fa fa-sack-dollar',
        url: '/admin/reservas',
        requiredRoles: ['ROLE_RESERVAS_R', 'ROLE_RESERVAS_W', 'ROLE_SUPER_ADMIN']
      },
      {
        id: 'huespedes',
        title: 'Huéspedes',
        type: 'item',
        icon: 'fa fa-user',
        url: '/admin/huespedes',
        requiredRoles: ['ROLE_HUESPEDES_R', 'ROLE_HUESPEDES_W', 'ROLE_SUPER_ADMIN']
      },
      {
        id: 'ubicaciones',
        title: 'Ubicaciones',
        type: 'item',
        icon: 'fa fa-map-marker-alt',
        url: '/admin/ubicaciones',
        requiredRoles: ['ROLE_SUPER_ADMIN']
      },
      {
        id: 'roles',
        title: 'Roles',
        type: 'item',
        icon: 'fa fa-users',
        url: '/admin/roles',
        requiredRoles: ['ROLE_SUPER_ADMIN']
      },
      {
        id: 'usuarios',
        title: 'Usuarios',
        type: 'item',
        icon: 'fa fa-user-circle',
        url: '/admin/usuarios',
        requiredRoles: ['ROLE_SUPER_ADMIN']
      },
    ],
  },
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
