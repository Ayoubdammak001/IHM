import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' }
  },
  {
    title: true,
    name: 'Client'
  },
  {
    name: 'My Profile',
    url: '/client/list',
    iconComponent: { name: 'cil-user' }
  },
  {
    name: 'My Reservations',
    url: '/client/reservations',
    iconComponent: { name: 'cil-calendar' }
  },
  {
    name: 'My Reviews',
    url: '/client/reviews',
    iconComponent: { name: 'cil-star' }
  },
  {
    name: 'Messages',
    url: '/client/messages',
    iconComponent: { name: 'cil-chat-bubble' }
  },
  {
    title: true,
    name: 'Provider'
  },
  {
    name: 'Provider Profile',
    url: '/provider/profile',
    iconComponent: { name: 'cil-user' }
  },
  {
    name: 'Service Requests',
    url: '/provider/requests',
    iconComponent: { name: 'cil-list' }
  },
  {
    name: 'My Services',
    url: '/provider/services',
    iconComponent: { name: 'cil-briefcase' }
  },
  {
    name: 'Reviews',
    url: '/provider/reviews',
    iconComponent: { name: 'cil-star' }
  },
  {
    title: true,
    name: 'Admin'
  },
  {
    name: 'Users',
    url: '/admin/users',
    iconComponent: { name: 'cil-people' }
  },
  {
    name: 'Categories',
    url: '/admin/categories',
    iconComponent: { name: 'cil-folder' }
  },
  {
    name: 'Reviews',
    url: '/admin/reviews',
    iconComponent: { name: 'cil-star' }
  }
];
