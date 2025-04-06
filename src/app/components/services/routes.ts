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

    ]
  }
];

