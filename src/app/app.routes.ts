import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { Role } from './models/enums';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Public pages
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'service/:id',
    loadComponent: () => import('./components/service-details/service-details.component').then(m => m.ServiceDetailsComponent)
  },

  {
    path: '',
    component: DefaultLayoutComponent,
    data: { title: 'Main' },
    children: [
      // Lazy modules
      {
        path: 'home',
        loadChildren: () => import('./components/home/routes').then(m => m.routes)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then(m => m.routes)
      },
      {
        path: 'client',
        loadChildren: () => import('./views/pages/client/client-routing.module').then(m => m.ClientRoutingModule)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then(m => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then(m => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then(m => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then(m => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then(m => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then(m => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then(m => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then(m => m.routes)
      },

      // Provider routes
      {
        path: 'provider',
        loadChildren: () => import('./components/provider/routes').then(m => m.routes)
      },

      // Admin routes
      {
        path: 'admin',
        loadChildren: () => import('./components/admin/routes').then(m => m.routes)
      }
    ]
  },

  // Error pages
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

  // Auth pages
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
