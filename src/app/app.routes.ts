import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: { title: 'Main' },
    children: [
      {
        path: 'home',
        loadChildren: () => import('./components/home/routes').then(m => m.routes),
        data: { title: 'Accueil' }
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then(m => m.routes)
      },
      {
        path: 'client',
        loadChildren: () => import('./views/pages/client/client.module').then(m => m.ClientModule)
      },
      {
        path: 'services',
        loadComponent: () => import('./views/pages/services/services.component').then(m => m.ServicesComponent),
        data: { title: 'Services' }
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: { title: 'Page 404' }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: { title: 'Page 500' }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: { title: 'Login Page' }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: { title: 'Register Page' }
  },
  { path: '**', redirectTo: '404' }
];
