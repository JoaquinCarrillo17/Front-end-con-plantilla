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
      },
      {
        id: 'habitaciones',
        title: 'Habitaciones',
        type: 'item',
        icon: 'fa fa-bed',
        url: '/habitaciones',
      },
      {
        id: 'huespedes',
        title: 'Huéspedes',
        type: 'item',
        icon: 'fa fa-user',
        url: '/huespedes',
      },
      {
        id: 'servicios',
        title: 'Servicios',
        type: 'item',
        icon: 'fa fa-cogs',
        url: '/servicios',
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
