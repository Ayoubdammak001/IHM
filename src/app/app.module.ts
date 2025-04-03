import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Importer CommonModule ici pour qu'il soit accessible dans tous les composants
import { CommonModule } from '@angular/common';  // Important pour *ngIf, *ngFor, etc.

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// ✅ Public components (non-standalone)
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';

// ✅ Client components
import { ClientDashboardComponent } from './components/client/client-dashboard/client-dashboard.component';
import { ClientProfileComponent } from './components/client/client-profile/client-profile.component';
import { ClientReviewsComponent } from './components/client/client-reviews/client-reviews.component';
import { ClientMessagesComponent } from './components/client/client-messages/client-messages.component';

// ✅ Provider components (uniquement ceux qui NE sont PAS standalone)
import { ProviderDashboardComponent } from './components/provider/provider-dashboard/provider-dashboard.component';

// ⚠️ `ProviderProfileComponent` est standalone, donc il ne devrait pas être ici
// ❌ Retire-le si tu l'as converti en standalone avec `standalone: true`
// import { ProviderProfileComponent } from './components/provider/provider-profile/provider-profile.component';

// ✅ Admin components
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users.component';
import { AdminCategoriesComponent } from './components/admin/admin-categories/admin-categories.component';
import { AdminReviewsComponent } from './components/admin/admin-reviews/admin-reviews.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,

    // Client
    ClientDashboardComponent,
    ClientProfileComponent,
    ClientReviewsComponent,
    ClientMessagesComponent,

    // Provider
    ProviderDashboardComponent,

    // Admin
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
    CommonModule  // Ajout de CommonModule ici
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
