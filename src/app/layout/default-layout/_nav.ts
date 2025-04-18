import { INavData } from '@coreui/angular';

// Navigation items for each role
const clientNavItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/client/dashboard',
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
  }
];

const providerNavItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/provider/dashboard',
    iconComponent: { name: 'cil-speedometer' }
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
  }
];

const adminNavItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/admin/dashboard',
    iconComponent: { name: 'cil-speedometer' }
  },
  {
    name: 'Magege Home Page',
    url: '/admin/home',
    iconComponent: { name: 'cil-home' }
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

// Function to get navigation items based on user role
export function getNavItems(role?: string): INavData[] {
  switch (role) {
    case 'CLIENT':
      return [...clientNavItems];
    case 'PROVIDER':
      return [...providerNavItems];
    case 'ADMIN':
      return [...adminNavItems];
    default:
      // Default navigation for not logged in or unknown roles
      return [
        {
          name: 'Home',
          url: '/',
          iconComponent: { name: 'cil-home' }
        },
        {
          name: 'Services',
          url: '/services',
          iconComponent: { name: 'cil-list' }
        }
      ];
  }
}

// Export a default navigation for use before auth status is determined
export const navItems: INavData[] = getNavItems();
