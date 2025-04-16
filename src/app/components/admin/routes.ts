import { Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { Role } from '../../models/enums';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';

export const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard, RoleGuard],
    // data: { roles: [Role.ADMIN] },
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
        path: 'home',
        component: AdminHomeComponent
      },
      {
        path: 'users',
        loadComponent: () => import('./admin-users/admin-users.component')
          .then(m => m.AdminUsersComponent),
        data: { title: 'Manage Users' }
      },
      {
        path: 'users/new',
        loadComponent: () => import('./admin-user-form/admin-user-form.component')
          .then(m => m.AdminUserFormComponent),
        data: { title: 'Add User' }
      },
      {
        path: 'users/:id/edit',
        loadComponent: () => import('./admin-user-form/admin-user-form.component')
          .then(m => m.AdminUserFormComponent),
        data: { title: 'Edit User' }
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
      },
    ]
  }
];
