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
    title: 'Chart',
    type: 'group',
    icon: 'icon-charts',
    children: [
      {
        id: 'apexChart',
        title: 'Hoteles Chart',
        type: 'item',
        url: '/hotel-chart',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart',
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
        type: 'collapse',
        icon: 'feather icon-server',
        children: [
          {
            id: 'listadoHoteles',
            title: 'Listado de hoteles',
            type: 'item',
            url: '/hoteles/list',
          },
          {
            id: 'registrarHotel',
            title: 'Registrar Hotel',
            type: 'item',
            url: '/hoteles',
          },
        ],
      },
      {
        id: 'habitaciones',
        title: 'Habitaciones',
        type: 'collapse',
        icon: 'feather icon-server',
        children: [
          {
            id: 'listadoHabitaciones',
            title: 'Listado de habitaciones',
            type: 'item',
            url: '/habitaciones/list',
          },
          {
            id: 'registrarHabitacion',
            title: 'Registrar Habitación',
            type: 'item',
            url: '/habitaciones',
          },
        ],
      },
      {
        id: 'huespedes',
        title: 'Huéspedes',
        type: 'collapse',
        icon: 'feather icon-server',
        children: [
          {
            id: 'listadoHuespedes',
            title: 'Listado de huéspedes',
            type: 'item',
            url: '/huespedes/list',
          },
          {
            id: 'registrarHuesped',
            title: 'Registrar Huésped',
            type: 'item',
            url: '/huespedes',
          },
        ],
      },
      {
        id: 'servicios',
        title: 'Servicios',
        type: 'collapse',
        icon: 'feather icon-server',
        children: [
          {
            id: 'listadoServicios',
            title: 'Listado de servicios',
            type: 'item',
            url: '/servicios/list',
          },
          {
            id: 'registrarServicio',
            title: 'Registrar Servicio',
            type: 'item',
            url: '/servicios',
          },
        ],
      },
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-home',
        classes: 'nav-item',
      },
    ],
  },
  {
    id: 'ui-element',
    title: 'UI ELEMENT',
    type: 'group',
    icon: 'icon-ui',
    children: [
      {
        id: 'basic',
        title: 'Component',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'button',
            title: 'Button',
            type: 'item',
            url: '/basic/button',
          },
          {
            id: 'badges',
            title: 'Badges',
            type: 'item',
            url: '/basic/badges',
          },
          {
            id: 'breadcrumb-pagination',
            title: 'Breadcrumb & Pagination',
            type: 'item',
            url: '/basic/breadcrumb-paging',
          },
          {
            id: 'collapse',
            title: 'Collapse',
            type: 'item',
            url: '/basic/collapse',
          },
          {
            id: 'tabs-pills',
            title: 'Tabs & Pills',
            type: 'item',
            url: '/basic/tabs-pills',
          },
          {
            id: 'typography',
            title: 'Typography',
            type: 'item',
            url: '/basic/typography',
          },
        ],
      },
    ],
  },
  {
    id: 'forms',
    title: 'Forms & Tables',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'forms-element',
        title: 'Form Elements',
        type: 'item',
        url: '/forms/basic',
        classes: 'nav-item',
        icon: 'feather icon-file-text',
      },
      {
        id: 'tables',
        title: 'Tables',
        type: 'item',
        url: '/tables/bootstrap',
        classes: 'nav-item',
        icon: 'feather icon-server',
      },
    ],
  },
  {
    id: 'chart-maps',
    title: 'Chart',
    type: 'group',
    icon: 'icon-charts',
    children: [
      {
        id: 'apexChart',
        title: 'ApexChart',
        type: 'item',
        url: 'apexchart',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart',
      },
    ],
  },
  {
    id: 'pages',
    title: 'Pages',
    type: 'group',
    icon: 'icon-pages',
    children: [
      {
        id: 'auth',
        title: 'Authentication',
        type: 'collapse',
        icon: 'feather icon-lock',
        children: [
          {
            id: 'signup',
            title: 'Sign up',
            type: 'item',
            url: '/auth/signup',
            target: true,
            breadcrumbs: false,
          },
          {
            id: 'signin',
            title: 'Sign in',
            type: 'item',
            url: '/auth/signin',
            target: true,
            breadcrumbs: false,
          },
        ],
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
