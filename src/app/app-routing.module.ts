import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Public components
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

// Client components
import { ClientReservationsComponent } from './components/client/client-reservations/client-reservations.component';
import { ClientProfileComponent } from './components/client/client-profile/client-profile.component';
import { ClientReviewsComponent } from './components/client/client-reviews/client-reviews.component';
import { ClientMessagesComponent } from './components/client/client-messages/client-messages.component';

// Provider (non-standalone) components
import { ProviderDashboardComponent } from './components/provider/provider-dashboard/provider-dashboard.component';

// Admin components
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminCategoriesComponent } from './components/admin/admin-categories/admin-categories.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminReviewsComponent } from './components/admin/admin-reviews/admin-reviews.component';

import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { Role } from './models/enums';

const routes: Routes = [
  // Public routes
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'service/:id',
    loadComponent: () =>
      import('./components/service-details/service-details.component').then(m => m.ServiceDetailsComponent)
  },

  // Standalone route for provider requests
  {
    path: 'provider/requests',
    loadComponent: () =>
      import('./components/provider/provider-requests/provider-requests.component').then(m => m.ProviderRequestsComponent)
  },

  // Client routes
  {
    path: 'client',
    children: [

      {
        path: 'profile',
        loadComponent: () =>
          import('./components/client/client-profile/client-profile.component')
            .then(m => m.ClientProfileComponent)
      },
      {
        path: 'reservations',
        loadComponent: () =>
          import('./components/client/client-reservations/client-reservations.component')
            .then(m => m.ClientReservationsComponent)
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('./components/client/client-reviews/client-reviews.component')
            .then(m => m.ClientReviewsComponent)
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./components/client/client-messages/client-messages.component')
            .then(m => m.ClientMessagesComponent)
      }
    ]
  },

  // Provider routes
  {
    path: 'provider',
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/provider/provider-dashboard/provider-dashboard.component')
            .then(m => m.ProviderDashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/provider/provider-profile/provider-profile.component')
            .then(m => m.ProviderProfileComponent)
      },
      {
        path: '+h',
        loadComponent: () =>
          import('./components/provider/provider-services/provider-services.component')
            .then(m => m.ProviderServicesComponent)
      },
      {
        path: 'reviews',
        loadComponent: () =>
          import('./components/provider/provider-reviews/provider-reviews.component')
            .then(m => m.ProviderReviewsComponent)
      }
    ]
  },

  // Admin routes
  {
    path: 'admin',
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/admin/admin-dashboard/admin-dashboard.component')
            .then(m => m.AdminDashboardComponent)
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./components/admin/admin-users/admin-users.component')
            .then(m => m.AdminUsersComponent)
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./components/admin/admin-categories/admin-categories.component')
            .then(m => m.AdminCategoriesComponent)
      },
      {
        path: 'reviews',
        component: AdminReviewsComponent
      }
    ]
  },

  // 404 fallback
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
