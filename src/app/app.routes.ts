import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ServiceDetailsComponent } from './components/service-details/service-details.component';
import { ClientDashboardComponent } from './components/client/client-dashboard/client-dashboard.component';
import { ClientReservationsComponent } from './components/client/client-reservations/client-reservations.component';
import { ProviderDashboardComponent } from './components/provider/provider-dashboard/provider-dashboard.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { Role } from './models/enums';
import { ClientProfileComponent } from './components/client/client-profile/client-profile.component';
import { ClientReviewsComponent } from './components/client/client-reviews/client-reviews.component';
import { ClientMessagesComponent } from './components/client/client-messages/client-messages.component';
import { ProviderProfileComponent } from './components/provider/provider-profile/provider-profile.component';
import { ProviderRequestsComponent } from './components/provider/provider-requests/provider-requests.component';
import { ProviderServicesComponent } from './components/provider/provider-services/provider-services.component';
import { ProviderReviewsComponent } from './components/provider/provider-reviews/provider-reviews.component';
import { AdminCategoriesComponent } from './components/admin/admin-categories/admin-categories.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';

export const routes: Routes = [
  // Redirection par défaut
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Routes publiques
  { path: 'home', component: HomeComponent },
  { path: 'service/:id', component: ServiceDetailsComponent },

  // Routes avec layout par défaut
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Main'
    },
    children: [
      // Existant
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      },

      // Routes Client
      {
        path: 'client',
        children: [
          { path: 'dashboard', component: ClientDashboardComponent },
          { path: 'profile', component: ClientProfileComponent },
          { path: 'reservations', component: ClientReservationsComponent },
          { path: 'reviews', component: ClientReviewsComponent },
          { path: 'messages', component: ClientMessagesComponent }
        ]
      },

      // Routes Provider
      {
        path: 'provider',
        children: [
          { path: 'dashboard', component: ProviderDashboardComponent },
          { path: 'profile', component: ProviderProfileComponent },
          { path: 'requests', component: ProviderRequestsComponent },
          { path: 'services', component: ProviderServicesComponent },
          { path: 'reviews', component: ProviderReviewsComponent }
        ]
      },

      // Routes Admin
      {
        path: 'admin',
        children: [
          { path: 'dashboard', component: AdminDashboardComponent },
          { path: 'users', component: AdminUsersComponent },
          { path: 'categories', component: AdminCategoriesComponent },
          { path: 'reviews', component: AdminUsersComponent }
        ]
      }
    ]
  },

  // Pages 404 et 500
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

  // Login et Register
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

  // Route fallback
  { path: '**', redirectTo: 'dashboard' }
];
