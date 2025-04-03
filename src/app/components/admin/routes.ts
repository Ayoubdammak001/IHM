import { Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { Role } from '../../models/enums';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [Role.ADMIN] },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin-dashboard/admin-dashboard.component')
          .then(m => m.AdminDashboardComponent),
        data: { title: 'Admin Dashboard' }
      },
      {
        path: 'users',
        loadComponent: () => import('./admin-users/admin-users.component')
          .then(m => m.AdminUsersComponent),
        data: { title: 'Manage Users' }
      },
      {
        path: 'categories',
        loadComponent: () => import('./admin-categories/admin-categories.component')
          .then(m => m.AdminCategoriesComponent),
        data: { title: 'Manage Categories' }
      },
      {
        path: 'reviews',
        loadComponent: () => import('./admin-reviews/admin-reviews.component')
          .then(m => m.AdminReviewsComponent),
        data: { title: 'Manage Reviews' }
      }
    ]
  }
]; 