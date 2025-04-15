import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Theme'
    },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'services',
        loadComponent: () => import('./services.component').then(m => m.ServicesComponent),
        data: {
          title: 'Colors'
        }
      },
      
  {
    path: 'service/:id',
    loadComponent: () => import('../service-details/service-details.component').then(m => m.ServiceDetailsComponent)
  },

    ]
  }
];

