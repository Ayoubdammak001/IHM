import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  // Routes publiques
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'service/:id', component: ServiceDetailsComponent },

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
  },

  // Route 404
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
