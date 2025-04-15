import { Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { Role } from '../../models/enums';

export const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard, RoleGuard],
    // data: { roles: [Role.PROVIDER] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./provider-dashboard/provider-dashboard.component')
          .then(m => m.ProviderDashboardComponent),
        data: { title: 'Provider Dashboard' }
      },
      {
        path: 'profile',
        loadComponent: () => import('./provider-profile/provider-profile.component')
          .then(m => m.ProviderProfileComponent),
        data: { title: 'Provider Profile' }
      },
      {
        path: 'services',
        loadComponent: () => import('./provider-services/provider-services.component')
          .then(m => m.ProviderServicesComponent),
        data: { title: 'Provider Services' }
      },
      {
        path: 'reviews',
        loadComponent: () => import('./provider-reviews/provider-reviews.component')
          .then(m => m.ProviderReviewsComponent),
        data: { title: 'Provider Reviews' }
      },
      {
        path: 'requests',
        loadComponent: () => import('./provider-requests/provider-requests.component')
          .then(m => m.ProviderRequestsComponent),
        data: { title: 'Provider Requests' }
      }
    ]
  }
];
