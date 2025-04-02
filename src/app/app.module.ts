import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ServiceDetailsComponent } from './components/service-details/service-details.component';
import { ClientDashboardComponent } from './components/client/client-dashboard/client-dashboard.component';
import { ClientProfileComponent } from './components/client/client-profile/client-profile.component';
import { ClientReviewsComponent } from './components/client/client-reviews/client-reviews.component';
import { ClientMessagesComponent } from './components/client/client-messages/client-messages.component';
import { ProviderDashboardComponent } from './components/provider/provider-dashboard/provider-dashboard.component';
import { ProviderProfileComponent } from './components/provider/provider-profile/provider-profile.component';
import { ProviderRequestsComponent } from './components/provider/provider-requests/provider-requests.component';
import { ProviderServicesComponent } from './components/provider/provider-services/provider-services.component';
import { ProviderReviewsComponent } from './components/provider/provider-reviews/provider-reviews.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminCategoriesComponent } from './components/admin/admin-categories/admin-categories.component';
import { AdminReviewsComponent } from './components/admin/admin-reviews/admin-reviews.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ServiceDetailsComponent,
    ClientDashboardComponent,
    ClientProfileComponent,
    ClientReviewsComponent,
    ClientMessagesComponent,
    ProviderDashboardComponent,
    ProviderProfileComponent,
    ProviderRequestsComponent,
    ProviderServicesComponent,
    ProviderReviewsComponent,
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminCategoriesComponent,
    AdminReviewsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
