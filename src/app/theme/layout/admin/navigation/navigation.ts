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
        url: '/hotel-chart',
        classes: 'nav-item',
        icon: 'fa fa-chart-line',
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
        url: '/hoteles',
        requiredRoles: ['ROLE_HOTELES_R', 'ROLE_HOTELES_W']
      },
      {
        id: 'habitaciones',
        title: 'Habitaciones',
        type: 'item',
        icon: 'fa fa-bed',
        url: '/habitaciones',
        requiredRoles: ['ROLE_HABITACIONES_R', 'ROLE_HABITACIONES_W']
      },
      {
        id: 'huespedes',
        title: 'Huéspedes',
        type: 'item',
        icon: 'fa fa-user',
        url: '/huespedes',
        requiredRoles: ['ROLE_HUESPEDES_R', 'ROLE_HUESPEDES_W']
      },
      {
        id: 'servicios',
        title: 'Servicios',
        type: 'item',
        icon: 'fa fa-cogs',
        url: '/servicios',
        requiredRoles: ['ROLE_SERVICIOS_R', 'ROLE_SERVICIOS_W']
      },
      {
        id: 'roles',
        title: 'Roles',
        type: 'item',
        icon: 'fa fa-users',
        url: '/roles',
        requiredRoles: ['ROLE_ROLES_R', 'ROLE_ROLES_W']
      },
      {
        id: 'usuarios',
        title: 'Usuarios',
        type: 'item',
        icon: 'fa fa-user-circle',
        url: '/usuarios',
        requiredRoles: ['ROLE_USUARIOS_R', 'ROLE_USUARIOS_W']
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
